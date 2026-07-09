import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  like,
  lt,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import type { AppDb, VanModel } from "~/db/client.server";
import { VanState, VanType, type VanType as VanTypeEnum } from "~/db/enums";
import { van } from "~/db/schema/van";
import type { BasePaginationParams } from "~/features/pagination/types";
import { getCursorMetadata } from "~/features/pagination/utils/get-cursor-metadata.server";
import type { List, Maybe, Prettify, Search } from "~/types";
import type { TypeFilter, VanFilters } from "../types";

const WHITESPACE_REGEX = /\s+/;
const VAN_TYPE_VALUES = new Set<string>(Object.values(VanType));

function parseVanTypeStrings(types: string[]): VanTypeEnum[] {
  return types
    .map((t) => t.toUpperCase())
    .filter((t): t is VanTypeEnum => VAN_TYPE_VALUES.has(t));
}

function buildVanTypeCondition(
  types: List<string>,
  typeFilter: Maybe<VanTypeEnum>
): SQL | undefined {
  if (types && types.length > 0) {
    const vanTypes = parseVanTypeStrings(types);
    if (vanTypes.length === 0) {
      return;
    }
    return inArray(van.type, vanTypes);
  }
  if (typeFilter) {
    return eq(van.type, typeFilter);
  }
}

function buildSearchConditions(search: string): SQL[] {
  const words = search
    .trim()
    .split(WHITESPACE_REGEX)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  return words.map((word) => {
    const pattern = `%${word}%`;
    return or(
      like(sql`lower(${van.name})`, pattern),
      like(sql`lower(${van.description})`, pattern)
    ) as SQL;
  });
}

type GetVansProps = Prettify<
  BasePaginationParams & TypeFilter & Search & VanFilters
>;

export function getVans(
  db: AppDb,
  {
    cursor,
    limit,
    direction,
    typeFilter,
    search,
    types,
    excludeInRepair,
    onlyOnSale,
  }: GetVansProps
) {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const conditions: SQL[] = [];

  const typeCondition = buildVanTypeCondition(types, typeFilter);
  if (typeCondition) {
    conditions.push(typeCondition);
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    conditions.push(...buildSearchConditions(trimmedSearch));
  }

  if (excludeInRepair) {
    conditions.push(ne(van.state, VanState.IN_REPAIR));
  }
  if (onlyOnSale) {
    conditions.push(eq(van.state, VanState.ON_SALE));
  }

  if (cursorId) {
    conditions.push(
      orderBy.id === "desc" ? lt(van.id, cursorId) : gt(van.id, cursorId)
    );
  }

  const idOrder = orderBy.id === "desc" ? desc(van.id) : asc(van.id);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.select().from(van).where(whereClause).orderBy(idOrder).limit(take);
}

export async function getVanBySlug(db: AppDb, slug: string) {
  const [result] = await db
    .select()
    .from(van)
    .where(eq(van.slug, slug))
    .limit(1);
  return result ?? null;
}

export async function createVan(
  db: AppDb,
  newVan: Prettify<Omit<VanModel, "id" | "createdAt" | "isRented">>
) {
  const [created] = await db
    .insert(van)
    .values({ ...newVan, isRented: false })
    .returning();
  return created;
}

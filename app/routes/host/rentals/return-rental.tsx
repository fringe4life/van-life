import {
  createContext,
  data,
  href,
  redirect,
  useNavigation,
} from "react-router";
import { css } from "styled-system/css/css";
import { vstack } from "styled-system/patterns";
import { CustomForm } from "~/components/custom-form";
import { FormError } from "~/components/form/form-error";
import { getNavigationFormStatus } from "~/components/form/get-fetcher-status";
import { readActionFormData } from "~/components/form/read-action-form-data";
import { useAutoIdleStatus } from "~/components/form/use-auto-idle-status";
import { CustomLink } from "~/components/links/custom-link";
import { RouteErrorBoundary } from "~/components/route-error-boundary";
import { StatusButton } from "~/components/status-button";
import {
  forwardDataHeaders,
  PRIVATE_NO_STORE_HEADERS,
} from "~/constants/cache-headers";
import type { HostRentedVan } from "~/features/host/services/rental.server";
import { VanCard } from "~/features/vans/components/van-card";
import { getCost } from "~/features/vans/utils/get-cost";
import { authContext } from "~/middleware/contexts/auth";
import { dbContext } from "~/middleware/contexts/db";
import { getHostRedirectUrl } from "~/middleware/utils/auth-redirect";
import { notFound } from "~/utils/errors/not-found";
import type { Route } from "./+types/return-rental";

interface SharedRentalData {
  money: number;
  rent: HostRentedVan;
}

const sharedRentalDataContext = createContext<SharedRentalData>();

const fetchSharedDataMiddleware: Route.MiddlewareFunction = async (
  { params, context },
  next
) => {
  /**
   * Workaround: `.server` modules imported here rather than at module scope, because
   * a static import survives React Router's client export removal and then trips its
   * `.server` resolver, so the route's client bundle never loads.
   *
   * @remarks
   * Still required on `@react-router/dev@8.5.1` with `vite@8.3.5` in `vite serve`.
   * Drop when upstream ships a fix; re-verify this module returns 200 and the page
   * hydrates. Full note: `app/routes/host/rental-activity.tsx`.
   *
   * @see https://github.com/remix-run/react-router/issues/14997 — open
   * @see https://github.com/fringe4life/van-life/issues/402 — tracking
   */
  const [{ parseUuidV7 }, { loadReturnRentalContext }, { throwDomainHttp }] =
    await Promise.all([
      import("~/dal/parse-uuidv7.server"),
      import("~/features/host/services/rental.server"),
      import("~/utils/errors/domain-error.server"),
    ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);

  // Asserted because `throwDomainHttp` above a destructured binding is not seen
  // as a `never` return for definite-assignment analysis; the catch always throws.
  let rentId!: ReturnType<typeof parseUuidV7>;
  try {
    rentId = parseUuidV7(params.rentId, "Invalid rental id");
  } catch (error) {
    throwDomainHttp(error);
  }

  const { rent, money } = await loadReturnRentalContext(db, rentId, user.id);

  if (!rent) {
    notFound("Rented van not found");
  }

  if (typeof money !== "number") {
    notFound("Account summary not found");
  }

  context.set(sharedRentalDataContext, { money, rent });

  return next();
};

export const middleware: Route.MiddlewareFunction[] = [
  fetchSharedDataMiddleware,
];

export const headers = forwardDataHeaders;

export const loader = ({ context }: Route.LoaderArgs) => {
  const rentalData = context.get(sharedRentalDataContext);

  return data(
    {
      ...rentalData,
    },
    { headers: PRIVATE_NO_STORE_HEADERS }
  );
};

export const action = async ({ params, context }: Route.ActionArgs) => {
  // Workaround: same `.server` import reason as the middleware above (#402).
  const [
    { parseUuidV7 },
    { completeReturnRental },
    { domainErrorToServiceResult, isDomainError },
    { toActionResultOrThrow },
  ] = await Promise.all([
    import("~/dal/parse-uuidv7.server"),
    import("~/features/host/services/rental.server"),
    import("~/utils/errors/domain-error.server"),
    import("~/utils/errors/to-action-result.server"),
  ]);

  const user = context.get(authContext);
  const db = context.get(dbContext);
  const { rent, money } = context.get(sharedRentalDataContext);

  let rentId: ReturnType<typeof parseUuidV7>;
  try {
    rentId = parseUuidV7(params.rentId, "Invalid rental id");
  } catch (error) {
    if (isDomainError(error)) {
      const actionFailure = toActionResultOrThrow(
        domainErrorToServiceResult(error)
      );
      if (actionFailure) {
        return actionFailure;
      }
    }
    throw error;
  }

  const result = await completeReturnRental(db, {
    money,
    rent,
    rentId,
    userId: user.id,
  });

  const actionFailure = toActionResultOrThrow(result);
  if (actionFailure) {
    return actionFailure;
  }

  throw redirect(href("/host"));
};

const ReturnRental = ({
  loaderData,
  actionData,
  params,
}: Route.ComponentProps) => {
  const { rent, money } = loaderData;
  const navigation = useNavigation();
  const isFormNavigation = Boolean(navigation.formMethod);
  const status = useAutoIdleStatus(
    getNavigationFormStatus(navigation.state, actionData, {
      isFormNavigation,
    })
  );

  const { formError } = readActionFormData(actionData);

  const amountToPay = getCost(rent.rentedAt, new Date(), rent.van);
  const isUnableToPay = money < amountToPay;
  return (
    <section className={vstack({ alignItems: "stretch", gap: "4" })}>
      <title>{`Return ${rent.van.name} | Vanlife`}</title>
      <meta
        content="The van you might return to it's owner"
        name="description"
      />
      <h2>Return this van:</h2>

      <div className={css({ maxInlineSize: "lg" })}>
        <VanCard
          action={
            <CustomForm method="POST">
              <StatusButton
                className={css({ justifySelf: "end" })}
                disabled={isUnableToPay}
                status={status}
                type="submit"
              >
                Return
              </StatusButton>
              <FormError message={formError} />
            </CustomForm>
          }
          link={href("/host/rentals/returnRental/:rentId", {
            rentId: params.rentId,
          })}
          van={rent.van}
        />
      </div>
      {!!isUnableToPay && (
        <article>
          <p className={css({ color: "destructive", fontSize: "lg" })}>
            You cannot afford to return this van.
          </p>
          <CustomLink
            to={getHostRedirectUrl(
              href("/host/rentals/returnRental/:rentId", {
                rentId: params.rentId,
              })
            )}
          >
            Top up your account
            <span className={css({ textDecoration: "underline" })}>here</span>
          </CustomLink>
        </article>
      )}
    </section>
  );
};
export default ReturnRental;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RouteErrorBoundary error={error} />
);

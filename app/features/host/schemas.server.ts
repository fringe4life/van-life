import {
  decimal,
  finite,
  forward,
  gtValue,
  maxValue,
  number,
  object,
  partialCheck,
  picklist,
  pipe,
  string,
  toNumber,
} from "valibot";
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from "~/constants/constants";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

const parsedAmountSchema = pipe(
  string(),
  decimal(),
  toNumber(),
  number(),
  finite(),
  gtValue(0, "greater than 0"),
  maxValue(MAX_ADD, `at most ${MAX_ADD}`)
);

/**
 * Money form: deposit/withdraw type + positive amount.
 * Persist absolute amounts; DAL signs WITHDRAW at read/aggregate time.
 */
export const moneySchema = pipe(
  object({
    amount: parsedAmountSchema,
    type: picklist([DEPOSIT, WITHDRAW]),
  }),
  forward(
    partialCheck(
      [["amount"], ["type"]],
      (input) => input.type !== DEPOSIT || input.amount >= MIN_ADD,
      `at least ${MIN_ADD}`
    ),
    ["amount"]
  ),
  forward(
    partialCheck(
      [["amount"], ["type"]],
      (input) => input.type !== WITHDRAW || input.amount >= MIN_WITHDRAW,
      `at least ${MIN_WITHDRAW}`
    ),
    ["amount"]
  )
);

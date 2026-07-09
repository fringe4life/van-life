import { type } from "arktype";
import { MAX_ADD, MIN_ADD, MIN_WITHDRAW } from "~/constants/constants";
import { DEPOSIT, WITHDRAW } from "~/features/vans/constants/vans-constants";

const moneyTransactionType = type.or(`"${DEPOSIT}"`, `"${WITHDRAW}"`);

/**
 * Money form: deposit/withdraw type + positive amount.
 * Pipe normalizes sign (deposits +, withdrawals -) for storage.
 */
export const moneySchema = type({
  amount: "string.numeric.parse",
  type: moneyTransactionType,
})
  .narrow((data, ctx) => {
    if (data.amount <= 0) {
      return ctx.reject({
        actual: String(data.amount),
        expected: "greater than 0",
        path: ["amount"],
      });
    }

    if (data.amount > MAX_ADD) {
      return ctx.reject({
        actual: String(data.amount),
        expected: `at most ${MAX_ADD}`,
        path: ["amount"],
      });
    }

    const minAmount = data.type === DEPOSIT ? MIN_ADD : MIN_WITHDRAW;

    if (data.amount < minAmount) {
      return ctx.reject({
        actual: String(data.amount),
        expected: `at least ${minAmount}`,
        path: ["amount"],
      });
    }

    return true;
  })
  .pipe((data) => ({
    amount: data.type === WITHDRAW ? -data.amount : data.amount,
    type: data.type,
  }));

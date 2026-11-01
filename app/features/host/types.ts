export const MONEY_FORM_FIELDS = ["amount"] as const;

/** Safe subset replayed to the client (amount + deposit/withdraw type). */
export const MONEY_ECHO_FIELDS = ["amount", "type"] as const;

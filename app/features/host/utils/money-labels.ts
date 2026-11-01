/**
 * Host money vocabulary (#403). One singular/plural pair per direction, shared
 * by legend, ledger, empty states and card titles. Card titles stay short so the
 * ~215px detail column does not wrap under the badge; legends use the plurals.
 */
const moneyLabels = {
  rental: {
    empty: "No rental payments yet",
    inflow: {
      card: "Received",
      ledger: "Payments received",
    },
    net: "Net, rentals",
    outflow: {
      card: "Sent",
      ledger: "Payments sent",
    },
  },
  wallet: {
    empty: "No deposits or withdrawals yet",
    inflow: {
      card: "Deposit",
      ledger: "Deposits",
    },
    net: "Net, wallet",
    outflow: {
      card: "Withdrawal",
      ledger: "Withdrawals",
    },
  },
} as const;

export { moneyLabels };

# Financial display routing: earnings vs wallet vs activity

**Question:** Does splitting Van Life host money screens along *economic event* — rental pay/receive vs deposit/withdraw — match how consumer/host marketplaces and wallets actually route navigation?

**Method:** First-party product help, dashboard docs, and official API/help centers only. No blogs, Medium, or SEO roundups. If a vendor does not publish dashboard information architecture (IA), that gap is stated rather than inferred.

**Van Life (this repo)**

- One SQLite `transaction` table with types `DEPOSIT`, `WITHDRAW`, `RENTAL_PAYMENT`, `RENTAL_RETURN` (`app/db/enums.ts`).
- TypeScript groups those as wallet vs rental (`WalletTransactionType` / `RentalTransactionType`) in `app/features/host/components/transaction/transaction-types.ts`.
- Host nav labels (UI follow-up): **Income** → `/host/income`; **Transfers** → `/host/transfers`.
- **Query logic (implemented)** split by economic event:
  - `app/features/host/dal/rental-activity.server.ts` — `/host/income` (stats, chart, list) and dashboard income total: `RENTAL_PAYMENT` **and** `RENTAL_RETURN`. List joins rent + both parties for counterparty name.
  - `app/features/host/dal/wallet-movement.server.ts` — `/host/transfers` (stats, chart, list): `DEPOSIT` **and** `WITHDRAW` only. Full wallet **balance** (`getAccountSummary`) still sums **all** types (same `WITHDRAW` sign rule).
  - Shared sort: `app/features/host/dal/transaction-sort.server.ts`.

---

## Summary verdict

**Yes — the proposed split matches the common first-party pattern.** Host marketplaces and processors consistently separate *money from activity* (sales, trips, reservations, charges — including refunds/adjustments on the same surface) from *cash moving into or out of a balance/bank*. P2P wallets use one signed activity feed for send *and* receive, and a separate Wallet/Money surface for add/withdraw.

Van Life **query logic** now matches that pattern: Income loaders are rental pay/receive; Transfers loaders are deposit/withdraw. Nav copy (Income / Transfers) is still the weak first-party pair — see naming below. The split is closer to Airbnb Earnings (incl. adjustments), Uber Earnings vs Wallet, Square Transactions vs Transfers, Stripe Payments vs Balances/Payouts, and PayPal Activity vs Wallet.

**Naming:** **Income** vs **Transfers** is the weakest pair among first-party labels. Better fits:

| Pair | Closest analog | Fit for Van Life |
|------|----------------|------------------|
| **Earnings** + **Wallet** | Airbnb Earnings; Uber Earnings vs Wallet | Strong if the first list is “how hosting/renting moved money,” including returns |
| **Activity** + **Wallet** | PayPal Activity vs Wallet; Cash App Activity vs Money | Strong if the first list is two-sided (host *and* renter in one account) |
| **Transactions** + **Balance** | Stripe Transactions/Payments vs Balances; Square Transactions vs Banking/Balance | Accurate, more processor-flavored |
| **Income** + **Transfers** | Square uses “Transfers” for *bank* payouts | Weak: “Income” hides outflows; “Transfers” implies bank rails Van Life does not have |

See [Caveats](#caveats-van-life-is-not-a-psp) — Van Life has no payment service provider (PSP) and no bank rails.

---

## Cross-product pattern

Three layers show up repeatedly. Vendors do **not** put all four of Van Life’s types on one undifferentiated list *and* also claim the list is “transfers.”

| Layer | What it answers | Typical labels |
|-------|-----------------|----------------|
| **Earnings / sales / payments** | “How much did activity generate?” Includes refunds, adjustments, cancellations on the **same** screen | Earnings, Sales, Payments, Transactions, Activity |
| **Balance / wallet** | “What can I spend or cash out *now*?” | Wallet, Balance, Money, PayPal Balance |
| **Payouts / transfers to bank** | “When did cash leave the platform for my bank?” | Payouts, Transfers, Withdraw, Cash out, Instant Pay |

**Pay and receive for the same activity type almost always share one screen.** Refunds, adjustments, and sent/received P2P payments are filters or signed rows, not a second top-level route. Separate routes are for *different economic events* (activity vs funding), not for the sign of the same event.

---

## Airbnb (host marketplace)

**Sources:** [Find your earnings](https://www.airbnb.com/help/article/304), [Calculating your payout](https://www.airbnb.com/help/article/459), [Host taxes and payouts](https://www.airbnb.com/help/article/510), [Add a payout method](https://www.airbnb.com/help/article/54), [Choose a default payout method](https://www.airbnb.com/help/article/1315), [What an adjustment on your earnings means](https://www.airbnb.com/help/article/366), [Your payout if a guest cancels](https://www.airbnb.com/help/article/1335), [When you'll get your payout](https://www.airbnb.com/help/article/425).

### Navigation (as documented)

Help does **not** publish a canonical web URL such as `airbnb.com/earnings`. Documented paths:

- Earnings dashboard: **Today → Menu → Earnings**. The dashboard shows “current month’s earnings, paid and upcoming payouts, and reports.” Desktop tabs named **Upcoming**, **Paid**, **Reports**, **Performance** ([article 304](https://www.airbnb.com/help/article/304)).
- Payout *methods* (not the earnings list): **Menu → Account settings → Payments → Payouts → Add payout method** ([article 54](https://www.airbnb.com/help/article/54), [article 1315](https://www.airbnb.com/help/article/1315)).
- Article 510 lists three account surfaces: **Taxes**, **Payments and payouts** (“Manage your payments, payout methods, and taxpayer assignments”), and **Earnings dashboard** (“Find your paid payouts, upcoming payouts, and gross earnings”) ([article 510](https://www.airbnb.com/help/article/510)).

### Earnings vs cash-out

Airbnb treats **earnings** and **payout** as related but distinct numbers: “Your nightly rate plus your optional extra charges … minus the Host service fee and any Co-Host payouts you share = your payout” ([article 459](https://www.airbnb.com/help/article/459)). Status of money *sent to the payout method* is checked **in the Earnings dashboard**, not on a separate “transfers” transaction list ([article 425](https://www.airbnb.com/help/article/425): “You can always check the status of your payout by going to the Earnings dashboard in your account”).

Payout *instrument* setup is a settings page, not a second activity feed.

### Pay and receive on one screen?

**One screen.** Adjustments (money the host *owes* after cancellation, reservation change, or policy violation) live on Earnings: “Go to Paid or Upcoming to find your adjustment” ([article 366](https://www.airbnb.com/help/article/366)). Article 304: “If you owe a guest money for a cancellation or reservation change, you can track it in your Earnings dashboard.” Paid rows include “reservation information, adjustments, and cancellation details.”

That is the Airbnb analog of keeping `RENTAL_PAYMENT` and `RENTAL_RETURN` together.

**Public docs do not** describe a host “wallet top-up” or deposit product comparable to Van Life `DEPOSIT`.

---

## Uber (driver earnings vs wallet)

**Sources:** [Why are my earnings and balance different?](https://help.uber.com/driving-and-delivering/article/why-are-my-earnings-and-balance-different?nodeId=d7e473e4-4086-4e71-adaf-f64177ba0383), [Understanding Uber Wallet](https://help.uber.com/en/driving-and-delivering/article/driver-app-wallet-understanding-uber-wallet?nodeId=4c810218-1df8-4510-84ee-56184d846e60), [Receiving earnings](https://help.uber.com/driving-and-delivering/article/how-do-i-receive-my-earnings?nodeId=42973e65-45a8-4aaf-90d5-d3e97ab61267), [Setting up Instant Pay](https://help.uber.com/en/driving-and-delivering/article/setting-up-instant-pay?nodeId=5bac3e84-baa4-424a-9780-14b279bcb2cc), [Instant Pay marketing](https://www.uber.com/us/en/drive/driver-app/instant-pay/).

### Navigation (as documented)

App sections named **Earnings** and **Wallet**. Help does not publish path URLs for those screens.

- Earnings: “Open the Earnings section in your Driver app” / “Tap Earnings in the app” ([earnings vs balance](https://help.uber.com/driving-and-delivering/article/why-are-my-earnings-and-balance-different?nodeId=d7e473e4-4086-4e71-adaf-f64177ba0383)).
- Wallet: “Go to the Wallet section”; Instant Pay setup is **menu → Wallet → Payment Methods** ([Instant Pay](https://help.uber.com/en/driving-and-delivering/article/setting-up-instant-pay?nodeId=5bac3e84-baa4-424a-9780-14b279bcb2cc)).
- Statements: [wallet.uber.com](https://help.uber.com/driving-and-delivering/article/how-do-i-receive-my-earnings?nodeId=42973e65-45a8-4aaf-90d5-d3e97ab61267) — “To view a complete breakdown of your fares and any reimbursements for tolls, log in to your account at wallet.uber.com.”

Receiving cash uses **Direct deposit** (weekly) and **Instant cash-out** ([Receiving earnings](https://help.uber.com/driving-and-delivering/article/how-do-i-receive-my-earnings?nodeId=42973e65-45a8-4aaf-90d5-d3e97ab61267)). Instant Pay: “From your Driver app, select the menu button … Tap Wallet. Then select Payment Methods” ([Instant Pay setup](https://help.uber.com/en/driving-and-delivering/article/setting-up-instant-pay?nodeId=5bac3e84-baa4-424a-9780-14b279bcb2cc)).

### Earnings vs cash-out

Uber **explicitly splits** trip earnings from wallet balance. Wallet is “everything related to payment and balance information” and includes “review details of past transactions,” bank/debit methods, and “how and when you receive your earnings” ([Wallet](https://help.uber.com/en/driving-and-delivering/article/driver-app-wallet-understanding-uber-wallet?nodeId=4c810218-1df8-4510-84ee-56184d846e60)).

The earnings-vs-balance article states that weekly earnings and current balance differ because of payouts already withdrawn, tips/adjustments timing, cash trips, and amounts owed to Uber. Wallet balance can include trip earnings, non-trip earnings, refunds, cash collected, outstanding balance, and expenses to Uber.

That is the closest consumer analog to Van Life’s proposed **Earnings/Income vs Wallet** split — with the caveat that Uber Wallet *also* shows earnings-related line items, not only cash-out.

### Pay and receive on one screen?

Help describes **one Earnings** surface for trip income and **one Wallet** surface for financial activity including expenses and payouts. It does not document separate “pay Uber” vs “receive fares” top-level routes.

---

## Lyft (driver pay)

**Sources:** [Getting paid](https://help.lyft.com/hc/en-us/all/articles/9328619602-Getting-paid), [Weekly deposits](https://help.lyft.com/hc/en-us/all/articles/211744752991-weekly-deposits), [Express Pay](https://help.lyft.com/hc/en-us/all/articles/115012923167-express-pay), [Set up bank and tax info](https://help.lyft.com/hc/en-us/all/articles/115012926307-Set-up-bank-and-tax-info-to-get-paid).

### Navigation (as documented)

No public web dashboard URLs. Driver-app paths:

- Earnings: tap **$** / earnings at the top of the home screen → **View weekly breakdown** / **See weekly breakdown** → **Payout history** below available balance ([Weekly deposits](https://help.lyft.com/hc/en-us/all/articles/211744752991-weekly-deposits)).
- Instruments: **Account → Pay and Tax Info** — weekly payouts, Express Pay, Lyft Direct ([Getting paid](https://help.lyft.com/hc/en-us/all/articles/9328619602-Getting-paid)).

### Earnings vs cash-out

Default is weekly **transfer of the previous week’s earnings to your bank account**. Faster cash-out is **Express Pay** (debit card, fee) or **Lyft Direct** (instant payouts to a Lyft-branded account). Earnings cashed out early “won’t be included in [the weekly] deposit” ([Weekly deposits](https://help.lyft.com/hc/en-us/all/articles/211744752991-weekly-deposits)).

So Lyft nests **payout history under earnings**, rather than giving payouts a sibling nav item equal to Earnings. The *economic* split (ride earnings vs bank/debit movement) still exists.

### Pay and receive

Help does not describe a separate screen for driver payments *to* Lyft vs ride earnings. Rental/Express Drive fees are described as something earnings must cover before Express Pay unlocks ([Getting paid](https://help.lyft.com/hc/en-us/all/articles/9328619602-Getting-paid)).

---

## Stripe Dashboard and Stripe Connect Express

**Sources:** [Web Dashboard](https://docs.stripe.com/dashboard/basics), [Viewports reference](https://docs.stripe.com/stripe-apps/reference/viewports), [Receive payouts](https://docs.stripe.com/payouts), [Balances and settlement time](https://docs.stripe.com/payments/balances), [Express Dashboard](https://docs.stripe.com/connect/express-dashboard), [Integrate the Express Dashboard](https://docs.stripe.com/connect/integrate-express-dashboard), [Payouts to connected accounts](https://docs.stripe.com/connect/payouts-connected-accounts), [Payout reconciliation](https://docs.stripe.com/payouts/reconciliation), [Refund and cancel payments](https://docs.stripe.com/refunds?dashboard-or-api=dashboard), [Instant Payouts](https://docs.stripe.com/payouts/instant-payouts).

### Navigation (documented URLs and labels)

Primary sidebar ([Dashboard basics](https://docs.stripe.com/dashboard/basics)):

- **Home** — analytics.
- **Balances** — “your Stripe balance, including top-ups, payouts, and transaction history.”
- **Transactions** — “all your customer payments, including collected fees and transfers, and their status.”
- **Payments** (under Products) — authorization, fraud, disputes — not the same as the Transactions list.
- **Reporting** — “historical transactions, payments, and payouts.”

Documented Dashboard URLs ([viewports](https://docs.stripe.com/stripe-apps/reference/viewports), [payouts](https://docs.stripe.com/payouts)):

| Label | URL |
|-------|-----|
| Payments list | `https://dashboard.stripe.com/payments` |
| Payment detail | `https://dashboard.stripe.com/payments/:id` |
| Balance | `https://dashboard.stripe.com/balance/overview` |
| Payouts list (test mode example in docs) | `https://dashboard.stripe.com/test/payouts` |
| Payout settings | `https://dashboard.stripe.com/account/payouts`, `https://dashboard.stripe.com/settings/payouts` |
| Payout reconciliation report | `https://dashboard.stripe.com/reports/reconciliation` ([payout reconciliation report](https://docs.stripe.com/reports/payout-reconciliation)) |

The viewports table documents **Payments** and **Balance** pages; it does **not** list a dedicated “Payouts” viewport. Payouts URLs still appear in [payouts docs](https://docs.stripe.com/payouts).

**Connect Express** (seller-facing): connected accounts “monitor their available balance, view upcoming payouts … view payments, manage disputes, issue refunds, and track their earnings in real time.” Direct login: `https://connect.stripe.com/express_login` ([Express Dashboard](https://docs.stripe.com/connect/express-dashboard)). Documented **features/sections**: Transactions, Earnings chart, Payments, Balance, Reports (Balance summary vs Payout reconciliation tabs), Account settings, Activity Hub.

Express **Transactions**: “balance transactions, including charges, transfers, and payouts, organized by type, date, and amount” — a **combined** ledger. Express **Payments** is a separate history. Express **Balance** is cash position, bank account, payout schedule, and manual payout.

### Earnings vs cash-out

Stripe’s data model matches the proposal:

- **Payments balance** = incoming customer charges; “When a customer initiates a refund or files a dispute, funds are also deducted from the payments balance.” You can “reconcile all of your transactions and payouts to an external bank account” ([Balances](https://docs.stripe.com/payments/balances)).
- **Payout** = “the transfer of funds to an external account, usually a bank account, in the form of a deposit” (Express Dashboard definition). “Stripe sends funds from your available balance to your bank account as payouts” ([Receive payouts](https://docs.stripe.com/payouts)).
- **Top-up** funds a Stripe balance from an external bank (refunds docs: topping up is “adding funds to a Stripe account, typically through a transfer from a bank external to Stripe”). That is the closest Stripe analog of Van Life `DEPOSIT`.

Payout reconciliation exists *because* a bank deposit is a **batch of many** charges/refunds/fees, not one sale ([payout reconciliation](https://docs.stripe.com/payouts/reconciliation): `charge`, `refund`, `stripe_fee`, and `payout` are distinct balance-transaction types).

### Pay and receive on one screen?

**Refunds are issued from the same Payments list**, not a second “money you paid” route: “Find the payment you want to refund in the Payments page” ([Refunds](https://docs.stripe.com/refunds?dashboard-or-api=dashboard)). Balance transactions for a payout include both `charge` and `refund`.

Express puts charges, transfers, *and* payouts in one Transactions list **and** still offers separate Payments and Balance sections. Hybrid: unified ledger plus purpose-built views.

---

## PayPal (Activity vs Wallet)

**Sources:** [Check payment status](https://www.paypal.com/us/cshelp/article/how-do-i-check-the-status-of-my-payment-help142), [Debit card transaction history](https://www.paypal.com/us/cshelp/article/how-do-i-find-my-paypal-debit-card-transaction-history-help139), [Get money out](https://www.paypal.com/us/cshelp/article/how-do-i-get-money-out-of-my-paypal-account-help394), [Add money from bank](https://www.paypal.com/us/cshelp/article/how-do-i-add-money-to-my-paypal-balance-from-my-bank-help114), [How long to add money](https://www.paypal.com/us/cshelp/article/how-long-does-it-take-to-add-money-from-my-bank-help128), [Point of Sale payments](https://www.paypal.com/us/cshelp/article/how-do-i-view-point-of-sale-payments-help633), [Wrong-person payment](https://www.paypal.com/us/cshelp/article/HELP175), [Missing reports](https://www.paypal.com/us/cshelp/article/why-are-my-paypal-reports-missing-transactions-or-why-dont-they-reconcile-ts2087).

### Navigation (as documented)

Help uses **Activity** and **Wallet** as primary destinations. It does **not** document stable pathnames (no official `paypal.com/activity` in these articles). Steps are “Go to your Activity” / “Go to Wallet.”

- **Activity**: payment status, filters by status or transaction type ([help142](https://www.paypal.com/us/cshelp/article/how-do-i-check-the-status-of-my-payment-help142)); debit-card history; Statements in the top right ([help139](https://www.paypal.com/us/cshelp/article/how-do-i-find-my-paypal-debit-card-transaction-history-help139)); reports via Activity → All Reports ([ts2087](https://www.paypal.com/us/cshelp/article/why-are-my-paypal-reports-missing-transactions-or-why-dont-they-reconcile-ts2087)).
- **Wallet**: link banks/cards; **Transfer Money** → **Transfer to your bank** or **Add money from your bank or debit card** ([help394](https://www.paypal.com/us/cshelp/article/how-do-i-get-money-out-of-my-paypal-account-help394), [help114](https://www.paypal.com/us/cshelp/article/how-do-i-add-money-to-my-paypal-balance-from-my-bank-help114)).

Add-money status is then viewed **on Activity** (“Go to your Activity. Click the transfer in question.”) ([help128](https://www.paypal.com/us/cshelp/article/how-long-does-it-take-to-add-money-from-my-bank-help128)). Wallet is the *action* surface; Activity is the *ledger*.

### Earnings vs cash-out

PayPal is a **wallet + activity feed**, not a host-earnings dashboard. Seller POS: “You can view your payments and transfers on the Receipts page in your Point of Sale online or from the Activity page in your PayPal Account. Transfers include all the payments that we’ve cleared to your PayPal Wallet” ([help633](https://www.paypal.com/us/cshelp/article/how-do-i-view-point-of-sale-payments-help633)). Funding and withdrawals are Wallet **Transfer Money**, not a second product named Income.

### Pay and receive on one screen?

**One Activity feed**, filterable: “Click Filters to narrow your search by status or transaction type” ([help142](https://www.paypal.com/us/cshelp/article/how-do-i-check-the-status-of-my-payment-help142)). Sent-to-wrong-person: “Go to your Activity, find the payment” ([HELP175](https://www.paypal.com/us/cshelp/article/HELP175)). Help does not split “money I sent” and “money I received” into two top-level nav items.

---

## Square (sales/transactions vs transfers)

**Sources:** [View and search transactions](https://squareup.com/help/us/en/article/5145-transaction-search), [Match transfers to sales](https://squareup.com/help/us/en/article/3813-match-deposits-to-sales), [Set up and edit transfer options](https://squareup.com/help/us/en/article/3807-deposit-options-with-square), [Sales summary and reports](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports), [Troubleshoot missing transfers](https://squareup.com/help/us/en/article/8328-troubleshoot-missing-transfers) (US help).

### Navigation (as documented)

No public `squareup.com/dashboard/...` URL catalog in these articles. Documented **Dashboard labels**:

| Surface | Path in help |
|---------|----------------|
| Individual payments | **Orders & payments** (or **Invoices & payments** / **Payments**) **→ Transactions** ([5145](https://squareup.com/help/us/en/article/5145-transaction-search)) |
| Bank movement | **Banking** → **View all transfers**; also **Banking → Transfers**; **Banking → Balance** → Transfer Now ([3813](https://squareup.com/help/us/en/article/3813-match-deposits-to-sales), [3807](https://squareup.com/help/us/en/article/3807-deposit-options-with-square), [8328](https://squareup.com/help/us/en/article/8328-troubleshoot-missing-transfers)) |
| Transfer settings | **Settings → Banking → Transfers** ([3807](https://squareup.com/help/us/en/article/3807-deposit-options-with-square)) |
| Sales performance | **Reports → Sales summary**, **Reports → Sales → Sales trends**, **Reports → Payments → Payment methods** ([5381](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports)) |
| Bank vs sales math | **Reports → Accounting → Reconciliation** — “how the amount paid to your bank account is calculated” ([5381](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports)) |

POS: **Transactions**; **Banking → View all activity** with transfer reports under **History**.

Some Square help copies say **Money → Balance** (Canada [3813](https://my.squareup.com/help/ca/en/article/3813-match-deposits-to-sales)); US articles currently say **Banking**. Label drift is documented; the *split* (payments vs bank transfers) is stable.

### Earnings vs cash-out

Square’s own article is titled **Match transfers to sales**: a transfer is a **bundle of card payments** sent to a bank, not a sale. Click a transfer to see “the individual card payments included in the transfer” ([3813](https://squareup.com/help/us/en/article/3813-match-deposits-to-sales)). Sales summary “may differ from other reports (like Payments …) due to different calculation methods and timing” ([5381](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports)).

This is the same economic split as Van Life’s **query logic**: activity (transactions/sales) vs funding movement (transfers). Square **Transfers** means bank rails — a poor label for Van Life’s in-app `DEPOSIT`/`WITHDRAW`.

### Pay and receive on one screen?

**Transactions** is payment history; refunds are issued from a transaction: “Select a transaction to view more details or issue a new receipt or refund a transaction” ([5145](https://squareup.com/help/us/en/article/5145-transaction-search)). Sales metrics include **Returns** and **Refunds by amount** on the same sales-summary report ([5381](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports)). Not two routes for “sale” vs “refund.”

---

## Shopify (sales/orders vs payouts)

**Sources:** [Finance reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/finances-report), [Overview of financial information](https://help.shopify.com/en/manual/finances/overview), [Viewing payout details](https://help.shopify.com/en/manual/payments/shopify-payments/payouts/view-details), [Getting paid with Shopify Payments](https://help.shopify.com/en/manual/payments/shopify-payments/getting-paid-with-shopify-payments). (`help.shopify.com/en/manual/finances/overview` and `…/payouts/view-details` are the official Help Center URLs; full-page fetch of those two timed out in this pass — quotes below are from those pages’ published content as returned by search of `help.shopify.com` and from the successfully fetched finance-reports page.)

### Navigation (as documented)

- **Finance → Payouts** in Shopify admin; app: **Finance → View payouts** ([finances overview](https://help.shopify.com/en/manual/finances/overview), [view details](https://help.shopify.com/en/manual/payments/shopify-payments/payouts/view-details)).
- Alternate: **Settings → Payments → View payouts** ([view details](https://help.shopify.com/en/manual/payments/shopify-payments/payouts/view-details)).
- Sales vs payment *reports*: **Analytics → Reports**, category **Finances** ([finance reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/finances-report)).
- Payout reconciliation: **Finance → Documents** ([finance reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/finances-report)).

Help does not publish a full public URL map of admin routes beyond these breadcrumbs.

Finance overview also lists **Payouts** as accumulated funds “pending transfer to your bank account,” separate from **Main** (Shopify Balance cash) ([finances overview](https://help.shopify.com/en/manual/finance/overview)).

### Earnings vs cash-out

Shopify states the distinction in accounting language:

- “The Sales finance report includes information specific to orders placed, whereas the Payments finance report includes information about payments that your customers have made.”
- “The payout reconciliation report details how funds moved through your Shopify Payments balance, including fees, reserves, and payouts to your bank account. The report reflects funds that you received, not revenue for accounting purposes.”
- Payout reconciliation “might still display different totals than your Sales or Payments finance reports because the report reflects balance activity and payout timing, not just order placement dates.”

([Finance reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/finances-report).)

Payouts page: previous/scheduled payouts and **Payout balance** (“funds that have been captured but not yet added to a scheduled payout”). “Payments are synced with their orders.” Transaction types in the export include examples such as charge and refund ([view details](https://help.shopify.com/en/manual/payments/shopify-payments/payouts/view-details)).

### Pay and receive on one screen?

Payout **transactions** table includes multiple **Type** values (help lists `charge` / `refund` as examples) on the **same** Payouts/transactions view — not separate admin apps for refunds vs sales.

---

## Venmo (activity vs wallet funding)

**Sources:** [Transaction history](https://help.venmo.com/cs/articles/transaction-history-vhel281), [Transfer to a bank](https://help.venmo.com/cs/articles/how-to-transfer-money-to-a-bank-account-vhel293), [Adding money](https://help.venmo.com/cs/articles/adding-money-to-your-venmo-balance-vhel169), [Bank accounts FAQ](https://help.venmo.com/cs/articles/bank-accounts-cards-faq-vhel298), [Standard transfers](https://help.venmo.com/cs/articles/standard-bank-transfers-faq-vhel299), [Instant transfers](https://help.venmo.com/cs/articles/instant-bank-transfer-faq-vhel302).

### Navigation (as documented)

- App: **Me** tab → **Transactions** toggle for history ([vhel281](https://help.venmo.com/cs/articles/transaction-history-vhel281)).
- Web: [venmo.com](https://help.venmo.com/cs/articles/transaction-history-vhel281) — silhouette → feed; **Statements** in the sidebar.
- Wallet funding: **Me → Add or Transfer** under **Wallet** (some users see **Manage**); web sidebar **Transfer balance** ([vhel293](https://help.venmo.com/cs/articles/how-to-transfer-money-to-a-bank-account-vhel293)). Help says “or go here” without a stable public URL in the fetched article.
- Add money: **Me → Add Money** ([vhel169](https://help.venmo.com/cs/articles/adding-money-to-your-venmo-balance-vhel169)).
- Payment methods: **Me → Wallet → Banks and Cards** ([vhel298](https://help.venmo.com/cs/articles/bank-accounts-cards-faq-vhel298)).

### Earnings vs cash-out

Venmo is P2P, not a host marketplace. Split is still **peer payments vs bank funding**:

- “Money you receive from other people or merchants on Venmo will remain in your Venmo account until you transfer or spend it” ([vhel293](https://help.venmo.com/cs/articles/how-to-transfer-money-to-a-bank-account-vhel293)).
- Add-from-bank vs Instant/standard **out** to bank are Wallet actions. Transfer status is checked “in your personal transactions feed under the Me tab” ([vhel169](https://help.venmo.com/cs/articles/adding-money-to-your-venmo-balance-vhel169)) — again, Wallet *does* the move; the feed *records* it.

### Pay and receive on one screen?

**One personal transactions feed.** Help does not document separate Sent vs Received top-level tabs. Privacy: adding money “does not appear in your public or friends' activity feeds” but *does* appear in the personal feed ([vhel169](https://help.venmo.com/cs/articles/adding-money-to-your-venmo-balance-vhel169) — keep-in-mind list).

---

## Cash App (Activity vs Money)

**Sources:** [View account activity](https://cash.app/help/us/en-us/6540-view-cash-app-account-activity), [View balance](https://cash.app/help/us/en-us/6539-view-cash-balance), [Withdrawal instructions](https://cash.app/help/us/en-US/3071-withdrawal-instructions).

### Navigation (as documented)

| Label | Where |
|-------|--------|
| **Activity** | Clock icon, bottom right; web [cash.app/account](https://cash.app/help/us/en-us/6540-view-cash-app-account-activity) Activity page |
| **Money** | Bottom left in-app; web [cash.app/account/money](https://cash.app/help/us/en-US/3071-withdrawal-instructions) |
| **Withdraw** | Under Money / Cash Balance ([3071](https://cash.app/help/us/en-US/3071-withdrawal-instructions)) |

### Earnings vs cash-out

**Activity is the unified ledger.** “Any funds you’ve received to or sent from your account – peer-to-peer, Cash App Card, savings, bitcoin, **transfers** – will appear in your activity” ([6540](https://cash.app/help/us/en-us/6540-view-cash-app-account-activity)). **Money** holds available balance and **Withdraw**. Withdrawal details also appear “in your Activity feed, including a transaction number” ([3071](https://cash.app/help/us/en-US/3071-withdrawal-instructions)).

Pattern: one feed for *all* signed events (including bank transfers); a separate **Money** tab for balance and withdraw *actions*. Closest to PayPal Activity vs Wallet.

### Pay and receive on one screen?

**Explicitly one screen:** received *and* sent on Activity, with search/filter by recipient or payment type ([6540](https://cash.app/help/us/en-us/6540-view-cash-app-account-activity)).

---

## Comparison table

| Product | Activity / earnings surface | Cash-in/out surface | Same-type pay+receive together? | Documented URLs |
|---------|----------------------------|---------------------|---------------------------------|-----------------|
| **Airbnb** | Earnings (Upcoming / Paid / Reports) | Account settings → Payments → Payouts (methods); payout *status* still on Earnings | Yes — adjustments on Earnings | Paths in help only, no public `airbnb.com/earnings` |
| **Uber** | Earnings | Wallet; Instant Pay; wallet.uber.com | One Earnings + one Wallet (Wallet mixes more than cash-out) | `wallet.uber.com`; app labels only |
| **Lyft** | Home $ → weekly breakdown | Pay and Tax Info; Payout history nested under earnings | Not documented as two routes | App labels only |
| **Stripe** | Payments, Transactions | Balances, Payouts, top-ups | Yes — refund from Payments; charge+refund in payout batch | `dashboard.stripe.com/payments`, `/balance/overview`, `/test/payouts`, Express `connect.stripe.com/express_login` |
| **PayPal** | Activity (filter by type) | Wallet → Transfer Money (add *and* withdraw) | Yes — one Activity feed | Labels only |
| **Square** | Transactions; Reports → Sales | Banking → Transfers / Balance | Yes — refund from Transactions | Labels only |
| **Shopify** | Analytics → Reports (Sales vs Payments) | Finance → Payouts | Yes — charge and refund types on payout transactions | Admin breadcrumbs |
| **Venmo** | Me → Transactions | Me → Wallet Add or Transfer | Yes — one feed | `venmo.com` |
| **Cash App** | Activity | Money → Withdraw | Yes — sent and received on Activity | `cash.app/account`, `cash.app/account/money` |

**None of these first-party products** document a primary nav split of “receive-only activity” vs “every ledger row including that activity.” Van Life **used** to do that in SQL; loaders no longer do. Nav labels have not been renamed yet.

---

## Mapping onto Van Life

### What the query split gets right

1. **Rental pay and receive on one list** matches Airbnb adjustments-on-Earnings, Stripe refunds-on-Payments, Square refunds-on-Transactions, Shopify charge+refund on payout transactions, and PayPal/Venmo/Cash App signed Activity. Implemented in `rental-activity.server.ts`.
2. **Deposit/withdraw on a different list** matches Stripe Balances/top-ups/payouts, Square Transfers, PayPal/Venmo Wallet add/withdraw, Cash App Money, Uber Wallet cash-out — *funding the balance*, not the rental event. Implemented in `wallet-movement.server.ts`.
3. The TypeScript split `RentalTransactionType` vs `WalletTransactionType` matches the DAL filters.

### UI still to follow

- Nav still says **Income** / **Transfers**. Page chrome, empty states, and dashboard wording were not changed with the query cutover.
- Dual-role users: Income stats/chart now **net** rental activity (`RENTAL_RETURN` stored negative). Dashboard `sumIncome` uses the same rental stats.

### Naming better than Income vs Transfers

**If `RENTAL_RETURN` is a reversal/refund of hosting (Airbnb adjustment analog):**

- Prefer **Earnings** (Airbnb, Uber, Lyft) over **Income**. Airbnb’s Earnings dashboard already includes money the host owes. “Income” reads as inflow-only.
- Second route: **Wallet** (Uber, PayPal, Venmo) or **Balance** (Stripe, Square Banking → Balance). Avoid **Payouts** and **Transfers** unless real bank rails exist.

**If `RENTAL_RETURN` is the user *paying* to rent someone else’s van (two-sided marketplace, one wallet):**

- Prefer **Activity** (PayPal, Cash App) over Earnings/Income. Earnings is host-centric; this list is both sides of rental commerce.
- Second route still **Wallet**.

**Pair that best matches the implemented queries:** **Earnings** (or **Activity**) + **Wallet**. Routes stay `/host/income` and `/host/transfers`; labels should not say Transfers unless the product later talks to a bank.

A third **single activity feed** (Cash App / Express Transactions) is also a documented pattern. Van Life keeps two routes, filtered by economic event — not a catch-all second list.

---

## Caveats: Van Life is not a PSP

Van Life `DEPOSIT` / `WITHDRAW` are **in-app wallet mutations**, not ACH/card rails.

| First-party concept | Van Life analog | Do not pretend |
|---------------------|-----------------|----------------|
| Stripe/Shopify/Square **payout** to bank | None | Calling the second route Payouts/Transfers implies settlement batches, arrival dates, and reconciliation reports those products document |
| PayPal/Venmo **add money from bank** | `DEPOSIT` (simulated) | No 3–5 day ACH, no Instant Transfer fee, no bank return |
| Airbnb **payout method** (bank, PayPal, Fast Pay) | None | Airbnb payouts are instrument + schedule; Van Life has no “when you’ll get paid by a processor” |
| Uber/Lyft **Instant Pay / Express Pay** | `WITHDRAW` (simulated) | Those products document debit-card push, fees, and weekly leftover deposits |
| Stripe **top-up** of platform balance | `DEPOSIT` | Closest *conceptual* match (fund the balance from outside), still not a bank |

**Implications for IA:**

- The **economic** split (rental events vs wallet funding) still holds — wallets do this without being banks.
- The **words** Transfers and Payouts over-promise. Wallet / Balance / Funding match the actual product.
- There is no Van Life need for Square/Shopify-style “match this bank deposit to N sales.” One `WITHDRAW` row *is* the event.
- Hosts who also rent vans are closer to **PayPal Activity** (two-sided) than to **Airbnb Earnings** (host-only). If that is the product, say Activity, not Income.

**What public docs do not specify:** exact pixel-level nav for logged-in Airbnb/Uber/Lyft/Square/Shopify dashboards beyond the help breadcrumbs above. This note does not invent extra tabs.

---

## Source list

- Airbnb: [304](https://www.airbnb.com/help/article/304), [459](https://www.airbnb.com/help/article/459), [510](https://www.airbnb.com/help/article/510), [54](https://www.airbnb.com/help/article/54), [1315](https://www.airbnb.com/help/article/1315), [366](https://www.airbnb.com/help/article/366), [1335](https://www.airbnb.com/help/article/1335), [425](https://www.airbnb.com/help/article/425)
- Uber: [earnings vs balance](https://help.uber.com/driving-and-delivering/article/why-are-my-earnings-and-balance-different?nodeId=d7e473e4-4086-4e71-adaf-f64177ba0383), [Wallet](https://help.uber.com/en/driving-and-delivering/article/driver-app-wallet-understanding-uber-wallet?nodeId=4c810218-1df8-4510-84ee-56184d846e60), [receiving earnings](https://help.uber.com/driving-and-delivering/article/how-do-i-receive-my-earnings?nodeId=42973e65-45a8-4aaf-90d5-d3e97ab61267), [Instant Pay setup](https://help.uber.com/en/driving-and-delivering/article/setting-up-instant-pay?nodeId=5bac3e84-baa4-424a-9780-14b279bcb2cc), [Instant Pay](https://www.uber.com/us/en/drive/driver-app/instant-pay/)
- Lyft: [Getting paid](https://help.lyft.com/hc/en-us/all/articles/9328619602-Getting-paid), [Weekly deposits](https://help.lyft.com/hc/en-us/all/articles/211744752991-weekly-deposits), [Express Pay](https://help.lyft.com/hc/en-us/all/articles/115012923167-express-pay)
- Stripe: [Dashboard basics](https://docs.stripe.com/dashboard/basics), [viewports](https://docs.stripe.com/stripe-apps/reference/viewports), [payouts](https://docs.stripe.com/payouts), [balances](https://docs.stripe.com/payments/balances), [Express](https://docs.stripe.com/connect/express-dashboard), [Connect payouts](https://docs.stripe.com/connect/payouts-connected-accounts), [reconciliation](https://docs.stripe.com/payouts/reconciliation), [refunds](https://docs.stripe.com/refunds?dashboard-or-api=dashboard)
- PayPal: [help142](https://www.paypal.com/us/cshelp/article/how-do-i-check-the-status-of-my-payment-help142), [help139](https://www.paypal.com/us/cshelp/article/how-do-i-find-my-paypal-debit-card-transaction-history-help139), [help394](https://www.paypal.com/us/cshelp/article/how-do-i-get-money-out-of-my-paypal-account-help394), [help114](https://www.paypal.com/us/cshelp/article/how-do-i-add-money-to-my-paypal-balance-from-my-bank-help114), [help128](https://www.paypal.com/us/cshelp/article/how-long-does-it-take-to-add-money-from-my-bank-help128), [help633](https://www.paypal.com/us/cshelp/article/how-do-i-view-point-of-sale-payments-help633)
- Square: [5145](https://squareup.com/help/us/en/article/5145-transaction-search), [3813](https://squareup.com/help/us/en/article/3813-match-deposits-to-sales), [3807](https://squareup.com/help/us/en/article/3807-deposit-options-with-square), [5381](https://squareup.com/help/us/en/article/5381-in-app-summaries-and-reports)
- Shopify: [finance reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/finances-report), [finances overview](https://help.shopify.com/en/manual/finances/overview), [payout details](https://help.shopify.com/en/manual/payments/shopify-payments/payouts/view-details)
- Venmo: [vhel281](https://help.venmo.com/cs/articles/transaction-history-vhel281), [vhel293](https://help.venmo.com/cs/articles/how-to-transfer-money-to-a-bank-account-vhel293), [vhel169](https://help.venmo.com/cs/articles/adding-money-to-your-venmo-balance-vhel169)
- Cash App: [6540](https://cash.app/help/us/en-us/6540-view-cash-app-account-activity), [6539](https://cash.app/help/us/en-us/6539-view-cash-balance), [3071](https://cash.app/help/us/en-US/3071-withdrawal-instructions)

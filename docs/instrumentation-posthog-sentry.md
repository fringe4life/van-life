# Instrumentation: PostHog vs Sentry vs Cloudflare vs others (this repo)

**Date:** 2026-09-11

**Question:** For this React Router 8.3.1 **framework-mode** app on Cloudflare Workers, what is the lightest officially documented path for error tracking plus useful product/ops telemetry (errors, traces, optionally session replay / product analytics)? Rank PostHog, Sentry, Cloudflare native observability, and other first-party options against: (1) lightweight instrumentation, (2) RR8 framework mode (SSR + client, loaders/actions, error boundaries), (3) lean client bundle, (4) Workers runtime (no Node-only SDKs), (5) decent free tier, (6) do not “use up” a unique Sentry free slot if that constraint exists. Answer whether Sentry Developer/free allows multiple projects vs one org, whether a second org needs a paid plan, and whether the existing SvelteKit Sentry use forces this app onto paid.

**Method:** Primary sources only, fetched 2026-09-11: [sentry.io/pricing](https://sentry.io/pricing/), [Sentry pricing & billing docs](https://docs.sentry.io/product/accounts/pricing/), [Sentry org setup](https://docs.sentry.io/organization/getting-started/), [Sentry membership](https://docs.sentry.io/organization/membership/), [Sentry quotas](https://docs.sentry.io/product/accounts/quotas/), [Sentry data retention](https://docs.sentry.io/security-legal-pii/security/data-retention-periods/), [Sentry React Router Framework](https://docs.sentry.io/platforms/javascript/guides/react-router/), [Sentry React Router manual setup](https://docs.sentry.io/platforms/javascript/guides/react-router/manual-setup/), [Sentry Cloudflare](https://docs.sentry.io/platforms/javascript/guides/cloudflare/), [Sentry Hydrogen + React Router](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen/), [Sentry Remix on Cloudflare](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/remix/), [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/), [Sentry tree-shaking](https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/), [Sentry session replay overhead](https://docs.sentry.io/product/session-replay/web/performance-overhead/), [npm `@sentry/react-router`](https://www.npmjs.com/package/@sentry/react-router), [npm `@sentry/cloudflare`](https://www.npmjs.com/package/@sentry/cloudflare), [PostHog pricing](https://posthog.com/pricing), [PostHog JS web](https://posthog.com/docs/libraries/js), [PostHog Cloudflare reverse proxy](https://posthog.com/docs/advanced/proxy/cloudflare), [PostHog Cloudflare Workers](https://posthog.com/docs/libraries/cloudflare-workers), [PostHog React Router](https://posthog.com/docs/libraries/react-router), [PostHog RR7 framework mode](https://posthog.com/docs/libraries/react-router/react-router-v7-framework-mode), [PostHog error tracking web](https://posthog.com/docs/error-tracking/installation/web), [PostHog privacy](https://posthog.com/docs/privacy), [PostHog self-host](https://posthog.com/docs/self-host), [Cloudflare Workers observability](https://developers.cloudflare.com/workers/observability/), [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), [Workers traces](https://developers.cloudflare.com/workers/observability/traces/), [Workers OTel export](https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/), [Tail Workers](https://developers.cloudflare.com/workers/observability/tail-workers/), [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/), [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/), [Web Analytics get started](https://developers.cloudflare.com/web-analytics/get-started/), [Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/), [React Router error boundaries](https://reactrouter.com/how-to/error-boundary), [React Router error reporting](https://reactrouter.com/how-to/error-reporting), [React Router middleware](https://reactrouter.com/how-to/middleware), [Plausible script](https://plausible.io/docs/plausible-script), [Plausible SPA](https://plausible.io/docs/spa-support), [Plausible Cloudflare proxy](https://plausible.io/docs/proxy/guides/cloudflare), [Plausible subscription plans](https://plausible.io/docs/subscription-plans), [Plausible trial](https://plausible.io/docs/trial), [Plausible lightweight](https://plausible.io/lightweight-web-analytics), [Plausible “when not to use”](https://plausible.io/when-not-to-use-plausible), [Umami docs](https://umami.is/docs), [Umami Cloud](https://umami.is/docs/cloud), [Umami pricing](https://umami.is/pricing), [Highlight GitHub](https://github.com/highlight/highlight), [GlitchTip](https://glitchtip.com/), [Bugsnag Cloudflare Workers](https://docs.bugsnag.com/platforms/javascript/cloudflare-workers/), [Bugsnag React](https://docs.bugsnag.com/platforms/javascript/react/), [Rollbar JS](https://docs.rollbar.com/docs/javascript), [Axiom pricing](https://axiom.co/pricing), [Honeycomb pricing](https://www.honeycomb.io/pricing), [Grafana Cloud pricing](https://grafana.com/pricing/), [Grafana Cloud intro](https://grafana.com/docs/grafana/latest/introduction/grafana-cloud/), [Grafana Cloud Free](https://grafana.com/products/cloud/free-tier/), [OpenTelemetry browser](https://opentelemetry.io/docs/languages/js/getting-started/browser/), [Amplitude HTTP API](https://amplitude.com/docs/apis/analytics/http-api-quickstart), [Amplitude Agent Analytics SDK (Workers note)](https://amplitude.com/docs/sdks/agent-analytics/sdk). No blogs, tweets, SEO roundups, or third-party comparison posts, except vendor-owned marketing pages that publish the same numbers as docs (Plausible script size, Grafana free included volumes). Gaps labeled **inference, not specified**.

**Van Life (this repo)** — facts from source, not from vendors:

- React Router **8.3.1 framework mode**: `@react-router/dev`, `app/routes.ts`, loaders/actions, `reactRouter()` Vite plugin, Worker `createRequestHandler` over `virtual:react-router/server-build` (`workers/app.ts`).
- Custom `app/entry.client.tsx` hydrates `HydratedRouter`. Custom `app/entry.server.tsx` uses `ServerRouter` + `renderToReadableStream` (not Node `renderToPipeableStream` / `@react-router/node`).
- Root exports `ErrorBoundary` (`app/root.tsx`). No `handleError` in `entry.server.tsx` today. No `clientMiddleware`. In-repo audit lists optional `clientMiddleware` for client-only analytics/timing (`docs/react-router-audit.md`).
- Cloudflare Workers: `@cloudflare/vite-plugin` via `@varlock/cloudflare-integration`, `wrangler.jsonc` with D1, `assets.not_found_handling: "single-page-application"`, `compatibility_flags: ["nodejs_compat"]`, **`observability.enabled: true` already**. Traces are **not** separately enabled (`observability.traces` absent).
- Vite 8, React 19.3, Bun, varlock.
- No Sentry / PostHog / analytics SDK in `dependencies` or `devDependencies`. Bun `overrides` pin `@opentelemetry/core` (transitive only).
- User already uses Sentry free tier on a **different SvelteKit project** (stated requirement; not in this tree).

Status labels used below:

| Label | Meaning |
|-------|---------|
| **Matches this architecture** | Official guide uses framework `entry.client` / `entry.server` + Worker `fetch` / `createRequestHandler` |
| **Needs Worker wrapper** | Official client/framework guide exists, but documented server path is Node (`NODE_OPTIONS`, `@react-router/node`, pipeable streams) and must be swapped for `@sentry/cloudflare` / `posthog-node` workerd / CF-native |
| **Client-only** | Browser SDK / snippet; no official Worker instrumentation |
| **Server-only** | Worker logs/traces; no official browser error / product-event SDK |
| **Not specified** | No first-party docs for this combo |

---

## 1. Verdict

**Do not treat Sentry Developer as “one free slot / one project.”** Official org setup says project count is **not limited** in sentry.io, recommends a project per repo, and mentions the free Developer plan by name when creating the default team. Quota (errors, spans, replays) is **organization-wide**, shared across projects. A user can belong to several organizations; each org has its own subscription. Nothing on [sentry.io/pricing](https://sentry.io/pricing/) or [pricing docs](https://docs.sentry.io/product/accounts/pricing/) says a second org requires Team/Business, or that one product “uses up” the free plan for other products. **Inference, not specified:** a second org can also sit on Developer. **Specified:** adding a van-life **project** on the existing SvelteKit org is the documented multi-app path; it shares the same 50k errors / 5M spans / 50 replays (as listed on the public pricing table), it does not force a paid plan by itself.

**Default `@sentry/react-router` wizard does not match this Worker.** The [manual setup](https://docs.sentry.io/platforms/javascript/guides/react-router/manual-setup/) is Node: `@sentry/profiling-node`, `instrument.server.mjs` via `NODE_OPTIONS='--import …'`, `createReadableStreamFromReadable` from `@react-router/node`, `renderToPipeableStream`. This app’s server is `workers/app.ts` + `renderToReadableStream`. The **matching** first-party pattern is [Hydrogen with React Router](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen/): `@sentry/react-router` **and** `@sentry/cloudflare`, client import `@sentry/react-router/cloudflare`, Worker `wrapRequestHandler` / `withSentry` around `createRequestHandler`. `@sentry/react-router` is **beta**; npm peer is `react-router` `7.x \|\| ^8.x` ([npm](https://www.npmjs.com/package/@sentry/react-router)). Cloudflare Workers SDK is GA-style first-party ([npm `@sentry/cloudflare`](https://www.npmjs.com/package/@sentry/cloudflare)).

**Lightest path that still covers client + server errors on Workers + RR8:** keep Cloudflare Workers Logs (already on) for **uncaught Worker exceptions and `console.error`**, add React Router’s documented [`handleError`](https://reactrouter.com/how-to/error-reporting) (server) and `HydratedRouter onError` (client) so caught route errors are not silent. That is **zero extra browser SDK**. It does **not** give grouped issues, source-mapped client stacks in a product UI, session replay, or product analytics. If grouped client+server issues matter: Sentry **errors-only** (`@sentry/cloudflare` on the Worker + `@sentry/react-router` client **without** `replayIntegration` / tracing if unused), tree-shaken, as a **second project on the existing org**.

**Lightest path that also covers product analytics:** Cloudflare Observability (server) + [Plausible](https://plausible.io/lightweight-web-analytics) (**2.5 KB gzipped**, official; SPA `pushState` auto) **or** [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) (free, no cookie; SPA route changes documented). Plausible Cloud is **not** forever-free (30-day trial, then paid). CF Web Analytics is free with no custom events.

**PostHog-only** is the one-vendor product+errors+replay option, with **first-party** RR7 framework-mode and Cloudflare Workers (`posthog-node` `workerd` export) docs. Free cloud: 1M analytics events, 5k recordings, 100k exceptions, **1 project**, 1-year retention, no card ([pricing](https://posthog.com/pricing)). Browser SDK is **not** lean unless you use `module.slim` / omit replay. Reverse proxy on Workers is first-party and recommended vs adblock. Self-host is out of scope for this app (**inference:** extra VM, officially unsupported ops).

**Sentry + PostHog together** is usually too heavy for requirement 1 and 3 unless PostHog is slim/snippet-only and Sentry is errors-only — still two browser SDKs.

**Do not pick Highlight.io as a primary path today:** `highlight.io` docs URLs redirected to LaunchDarkly on fetch; GitHub OSS still exists. **Do not pick GlitchTip for Workers** without a custom Sentry-SDK ingest; no first-party Workers guide found (`docs.glitchtip.com` 500). Bugsnag **does** have first-party Workers + React plugins. Rollbar: no first-party Workers path found. Mixpanel / Amplitude / Tinybird: no lean first-party RR8+Workers story (Amplitude Node SDK **cannot** bundle on Workers).

---

## 2. Must-answer (explicit)

### 2.1 Does Sentry Developer/free allow multiple projects in one org, or one project?

**Multiple projects. Not one project.** [Set Up Your Organization](https://docs.sentry.io/organization/getting-started/) §4:

> You could theoretically put all your errors into a single project, as this isn't limited in sentry.io. However, setting up multiple projects… If your application's source code is managed in multiple repositories, create a separate project for each repo.

Same page, Developer plan named:

> Even on our free Developer plan, Sentry automatically sets up a team for you based on the name of your organization…

[Projects](https://docs.sentry.io/product/projects/) likewise: a project is a service/application; create more for finer granularity. [Quotas](https://docs.sentry.io/product/accounts/quotas/) Stats break usage down **by project** against **organization** quota. Spike Protection’s formula caps the *project-count adjustment at 5* for the floor calculation — that is **not** a max project count ([spike protection](https://docs.sentry.io/pricing/quotas/spike-protection.md)).

**Not specified:** a hard numeric cap on projects on Developer. **Specified:** “isn’t limited in sentry.io.”

### 2.2 Does using Sentry on the SvelteKit app consume a unique “free slot” that would force this app onto a paid plan?

**No such unique slot is documented.** Quote from [Plans and Free Trials](https://docs.sentry.io/product/accounts/pricing/):

> Sentry has one free Developer plan and three paid plans: Team, Business, and Enterprise.

Developer is **per organization**, not per GitHub repo. [Data storage location](https://docs.sentry.io/organization/data-storage-location/):

> If you have multiple organizations, they will be treated separately… subscriptions, usage, users, projects, and so on, will be managed separately for each organization.

[Membership](https://docs.sentry.io/organization/membership/): “A user can be a Member of several organizations.” Pricing lists Developer as **Free**, **one user**, error monitoring and tracing ([sentry.io/pricing](https://sentry.io/pricing/)). Public quota table on that page (as of fetch): **50k errors**, **5M spans**, **50 replays**, **1 GB attachments**, plus 1 uptime / 1 cron monitor in the comparison grid. [Paid-plan docs](https://docs.sentry.io/product/accounts/pricing/) list the same volumes as the “pre-set monthly event volume” on **paid** plans; Developer is listed separately in [retention](https://docs.sentry.io/security-legal-pii/security/data-retention-periods/) (30 days). **Inference, not specified:** Developer includes the same 50k/5M/50 numbers shown on the pricing grid (the grid is not labeled per-column in the fetched HTML). **Specified:** exceeding quota drops data; increasing quota requires Team/Business ([manage error quota](https://docs.sentry.io/pricing/quotas/manage-event-stream-guide.md)).

So: SvelteKit on org A, project 1 does **not** force van-life onto paid. Add **project 2** on org A (shared quota). Or create org B (**inference:** can be Developer too). What *would* force paid: more than **one user**, PAYG overages, or wanting Team-only features (unlimited users, API/integrations, etc.).

### 2.3 Official `@sentry/react-router` for framework mode on Cloudflare? Recommended packages?

**Yes as a documented combo, not as the default RR wizard.**

| Piece | Package / API | Source |
|-------|----------------|--------|
| Framework client + RR tracing | `@sentry/react-router` (beta). Client: `Sentry.init`, `reactRouterTracingIntegration()`, `HydratedRouter onError={Sentry.sentryOnError}` | [RR framework](https://docs.sentry.io/platforms/javascript/guides/react-router/), [manual](https://docs.sentry.io/platforms/javascript/guides/react-router/manual-setup/), [npm](https://www.npmjs.com/package/@sentry/react-router) |
| Cloudflare Worker wrap | `@sentry/cloudflare`: `withSentry` / `wrapRequestHandler`; Vite `sentryCloudflareVitePlugin`; needs `nodejs_compat` (this repo already has it) | [CF guide](https://docs.sentry.io/platforms/javascript/guides/cloudflare/), [npm](https://www.npmjs.com/package/@sentry/cloudflare) |
| **This architecture (RR framework + Worker `createRequestHandler`)** | Hydrogen guide: `npm install @sentry/react-router @sentry/cloudflare`; client `import * as Sentry from "@sentry/react-router/cloudflare"`; Worker `wrapRequestHandler` around `createRequestHandler({ build: await import("virtual:react-router/server-build") })`; `entry.server` `injectTraceMetaTags` + `wrapSentryHandleRequest` + `handleError` `captureException` | [Hydrogen + RR](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen/) |
| **Do not use as-is** | Default RR server: Node `instrument.server.mjs`, `@sentry/profiling-node`, `@react-router/node` pipeable stream | [manual setup](https://docs.sentry.io/platforms/javascript/guides/react-router/manual-setup/) |
| Library-mode SPA only | `@sentry/react` + `reactRouterV7BrowserTracingIntegration` — **not** this app’s SSR Worker | [React guide](https://docs.sentry.io/platforms/javascript/guides/react/) |
| Remix (not RR8 framework) | `@sentry/remix` + CF Pages middleware — **not** this tree | [Remix on CF](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/remix/) |

`@sentry/react-router` wraps `@sentry/node` (server) and `@sentry/browser` (client) ([npm README](https://www.npmjs.com/package/@sentry/react-router)). On Workers, follow Hydrogen: do not run the Node auto-instrumentation path.

### 2.4 PostHog on Cloudflare Workers: first-party or community? Node vs fetch? Reverse proxy?

**First-party.** [Cloudflare Workers](https://posthog.com/docs/libraries/cloudflare-workers): install `posthog-node`; dedicated **`workerd` export** “avoids Node.js built-ins — it does not require `nodejs_compat` on its own”; `flushAt: 1`, `flushInterval: 0`; `ctx.waitUntil(captureImmediate)` + `shutdown()`. React Router 7 env: `context.cloudflare.env.VAR_NAME`; waitUntil: `context.cloudflare.ctx.waitUntil()`. Recommends **new client per request**.

[Reverse proxy](https://posthog.com/docs/advanced/proxy/cloudflare): **official** Worker that forwards to `us.i.posthog.com` / assets host. Option 1 works on **all CF plans including free**. Option 2 (DNS + Page Rules) needs **Enterprise**. They recommend proxying so ad blockers miss PostHog hosts. Separate Worker (or route) vs this app’s `workers/app.ts` — **inference:** can be a second Worker or a path on the same Worker; docs show a dedicated Worker + custom domain.

Browser SDK is `posthog-js` ([JS web](https://posthog.com/docs/libraries/js)), not the Node SDK.

### 2.5 What Cloudflare Observability already gives this repo for free — and what it does not

**Already on:** `wrangler.jsonc` `"observability": { "enabled": true }`. [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/): that setting writes invocation logs, `console.log`, errors, uncaught exceptions. Newly created Workers default this on. Head sampling default 1 (100%).

**Free Workers plan (as of fetch):** 200,000 log events **per day**, **3-day** retention. Paid: 20M/month included, 7-day retention, $0.60/million extra. Daily account cap 5 billion logs then 1% sample. Max log size 256 KB.

**Traces:** **not** implied by `observability.enabled` today. Docs: “While automatic tracing is in early beta, this setting will not enable tracing by default, and will only enable logs.” Enable with `observability.traces.enabled = true`. Tracing currently free in beta; **billed from 1 October 2026** as the same event quota as logs (Free: 200k/day, 3-day retention).

**OTel export** to Honeycomb / Grafana / Axiom / Sentry / PostHog (logs only for PostHog): [exporting OTel](https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/). Table lists Sentry traces+logs, PostHog **logs only** (`https://{REGION}.i.posthog.com/i/v1/logs`). **Workers Free: OTel export “Not available”** in the paid/free table; beta currently free for **Workers Paid**. Custom spans via `import { tracing } from "cloudflare:workers"` ([traces](https://developers.cloudflare.com/workers/observability/traces/), [custom spans](https://developers.cloudflare.com/workers/observability/traces/custom-spans/)). **No SDK required** for platform spans (fetch, bindings, handlers).

**Tail Workers:** Paid/Enterprise only ([Tail Workers](https://developers.cloudflare.com/workers/observability/tail-workers/)). CF now prefers OTel export over Tail for Sentry/Grafana/Honeycomb.

**Does not give:** grouped client JS errors with source maps in a product UI; SPA client navigations as product events (Workers Logs see HTTP to the Worker / `.data` fetches, not React tree errors unless they hit the server); session replay; feature flags; funnels; cookie-less marketing analytics dashboards. Client `ErrorBoundary` errors that never hit the Worker are **invisible** unless you add a browser reporter.

**Cloudflare Web Analytics** is a **different product** ([overview](https://developers.cloudflare.com/web-analytics/)): privacy RUM, all plans, JS beacon. SPA: extra beacon on every route change ([FAQ](https://developers.cloudflare.com/web-analytics/faq/)). No custom events (“Not yet”). No UTM. Soft limit 10 sites. Unsampled 7 days then ~10% aggregate; dashboard previous six months. Ad blockers **do** block the beacon. Automatic inject may fight `Cache-Control: public, no-transform` and this app’s Worker HTML (manual snippet more reliable — **inference** for SSR Worker HTML).

### 2.6 Lightest path that still covers client + server errors

1. **Zero SDK (ops-grade, not issue tracker):** CF Workers Logs (already) + RR [`handleError`](https://reactrouter.com/how-to/error-reporting) `console.error` (server) + `HydratedRouter onError` `console.error` (client). Server exceptions already appear in Workers Logs. Client `onError` only shows in CF if you also `fetch` a Worker endpoint or leave it in the browser console. **Gap:** no grouping, no source maps product, client errors may never leave the browser.
2. **Lightest real issue tracker matching this stack:** Sentry errors-only — `@sentry/cloudflare` wrap in `workers/app.ts` + `@sentry/react-router/cloudflare` in `entry.client.tsx` **without** Replay/Feedback integrations ([tree-shaking](https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/)). Wire `handleError` + root `ErrorBoundary` `captureException` as in Hydrogen + npm README. Second **project** on existing org.
3. **PostHog errors:** `posthog.captureException` in root `ErrorBoundary` ([RR7 framework](https://posthog.com/docs/libraries/react-router/react-router-v7-framework-mode)) + Worker `posthog-node` `captureException`. Heavier client unless slim/no-external.

### 2.7 Lightest path that also covers product analytics

- **Privacy pageviews only, free forever:** Cloudflare Web Analytics beacon (SPA route changes yes; no custom events).
- **Privacy pageviews + custom events, smallest published script:** Plausible **2.5 KB gzip** ([lightweight](https://plausible.io/lightweight-web-analytics)); SPA automatic ([SPA support](https://plausible.io/docs/spa-support)); official CF Worker proxy ([proxy](https://plausible.io/docs/proxy/guides/cloudflare)). Cloud: 30-day trial then **paid**; CE self-host free.
- **Product analytics + errors in one vendor:** PostHog; use slim / omit replay; proxy on Workers; `posthog-node` for loaders/actions.

### 2.8 Bundle-size ranking (only vendor-published or npm; else unknown)

| Rank (smallest first) | SDK | Published size | Source | Notes |
|-----------------------|-----|----------------|--------|--------|
| 1 | Plausible tracker | **2.5 KB gzipped** | [lightweight](https://plausible.io/lightweight-web-analytics), [GA script size](https://plausible.io/google-analytics-script-size) | Official. SPA included in default script. |
| 2 | Cloudflare Web Analytics `beacon.min.js` | **Not published** | [FAQ](https://developers.cloudflare.com/web-analytics/faq/) | Exists; no KB figure. |
| 3 | Umami tracker | **Not published** | [docs](https://umami.is/docs) | Self-host or Cloud. |
| 4 | Sentry browser **errors only** | **Not published as gzip KB** for npm `@sentry/browser` / `@sentry/react-router` | [CDN bundles](https://docs.sentry.io/platforms/javascript/install/loader.md) list names (`bundle.min.js` etc.) without sizes; [tree-shaking](https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/) | Can omit Replay/tracing. |
| 5 | Sentry Session Replay plugin | **~36 KB gzipped additional** (as of SDK 7.78.0; page fetched 2026-09-11 still used that figure) | [Replay performance overhead](https://docs.sentry.io/product/session-replay/web/performance-overhead/) | Do not enable if lean is first-class. |
| 6 | PostHog `posthog-js` default | **Not published as gzip KB** | [JS web](https://posthog.com/docs/libraries/js) | Core loads first; replay/surveys **lazy-load** from CDN. `module.no-external` disables extensions. Experimental `module.slim` + extension bundles to omit flags/replay/analytics. |
| 7 | OpenTelemetry browser (`@opentelemetry/sdk-trace-web` + instrumentations) | **Not published** | [OTel browser](https://opentelemetry.io/docs/languages/js/getting-started/browser/) | **Experimental**. |
| — | `@sentry/cloudflare` / `posthog-node` | N/A (Worker only) | — | Must not ship in client graph (`.server` / Worker entry). |

Bundlephobia / npm package pages were consulted for `@sentry/react-router` and `@sentry/cloudflare` (versions **10.74.0**, 2026-09-09); they do **not** publish gzip sizes on the npm README. `posthog-js` npm page was blocked by a bot challenge on fetch.

### 2.9 Ranked options for **this** repo

**A — If Sentry org already used for SvelteKit (recommended default for errors):**  
**1. Cloudflare Observability (keep) + Sentry errors-only as a second project on the same org** (Hydrogen/`@sentry/cloudflare` pattern). Why: RR8+Workers documented; no unique free slot; lean if Replay off; D1 helper `instrumentD1WithSentry` exists ([CF SDK README](https://www.npmjs.com/package/@sentry/cloudflare)). Quota shared with SvelteKit — sample traces.  
**2. Cloudflare Observability only + RR `handleError`/`onError`.** Why: already paid-for-free on Workers Free logs; lightest; weak client issues UX.  
**3. PostHog-only** (framework-mode + `posthog-node` workerd). Why: best single product for analytics+errors+replay; 1-project free cap is fine (this app + maybe marketing later is the constraint); heavier JS unless slim; proxy extra Worker.

**B — If “do not put this app on the existing Sentry org” (quota isolation / mental model):**  
**Inference:** create a second Sentry org on Developer (docs allow multiple orgs, do not forbid a second free org). If that is refused by product/UI (not specified), skip Sentry: **CF Observability + Plausible or CF Web Analytics**, or **PostHog-only**.

**C — Product analytics required, errors already covered by CF or Sentry:**  
**Plausible** (smallest published script) or **CF Web Analytics** (free). Do not add full PostHog **and** Sentry Replay.

**Avoid:** default Sentry Node wizard; `@sentry/profiling-node` on Workers; Sentry Replay + PostHog replay; Amplitude/Mixpanel Node SDKs on the Worker; Highlight.io until their docs host is first-party again.

---

## 3. This architecture vs vendor guides

Request path (this repo): `workers/app.ts` `fetch` → `RouterContextProvider` + D1 → `createRequestHandler(virtual:react-router/server-build)` → loaders/actions/middleware → `entry.server.tsx` `handleRequest` (`ServerRouter` + `renderToReadableStream`). Client: `entry.client.tsx` `hydrateRoot(<HydratedRouter />)`. Errors: root `ErrorBoundary`. RR docs: server reporting = `handleError` export; client = `HydratedRouter onError` ([error reporting](https://reactrouter.com/how-to/error-reporting)). Error boundaries are **not** for reporting ([error boundary](https://reactrouter.com/how-to/error-boundary)). Optional `clientMiddleware` for analytics on every client navigation ([middleware](https://reactrouter.com/how-to/middleware), unused here).

| Vendor guide | Match? |
|--------------|--------|
| Sentry RR framework **default** (Node pipeable, `NODE_OPTIONS`) | **Needs Worker wrapper.** Conflicts with `renderToReadableStream` / no `react-router-serve`. |
| Sentry **Hydrogen + RR** | **Matches** (same `virtual:react-router/server-build`, `HydratedRouter`, `handleError`). Oxygen-specific: “never import `@sentry/cloudflare` except `/request` subpath” — **inference:** on Cloudflare Workers (not Oxygen) `withSentry` from `@sentry/cloudflare` is the [Workers](https://docs.sentry.io/platforms/javascript/guides/cloudflare/) path; Hydrogen’s `/request` wrap is the portable bit. |
| Sentry Remix on CF | Remix `@sentry/remix` + Pages `_middleware.js`. **Not this tree.** Pattern (CF wrap + `handleError`) still informative. |
| PostHog RR7 framework mode | **Matches** `entry.client.tsx` + `HydratedRouter` + root `ErrorBoundary` + RR middleware. Server example uses `process.env` and `posthog.shutdown()` in middleware; on Workers prefer `context.cloudflare.env` + `waitUntil` per [Workers](https://posthog.com/docs/libraries/cloudflare-workers/) (**needs Worker wrapper** for env/flush, not for routing). `ssr.noExternal: ['posthog-js', '@posthog/react']` Vite note. |
| PostHog Remix | Redirects to RR7 framework. Ignore Remix Vite `remix()` snippet. |
| CF Observability | **Matches** wrangler; no app code required for logs. Custom spans optional. |
| Plausible / CF Web Analytics | **Client-only** snippet in document (`Layout` / `entry.server`). SPA: both claim route-change beacons. |
| Bugsnag CF plugin | **Matches Worker `fetch` wrap**; React `ErrorBoundary` is separate SPA-style plugin — wire to RR boundary yourself (**not specified** as RR framework). |

---

## 4. Comparison (pros / cons vs this app)

| Option | Pros for this app | Cons for this app |
|--------|-------------------|-------------------|
| **Sentry** (`@sentry/react-router` + `@sentry/cloudflare`) | Official RR framework + Worker wrap; D1 helper; Replay optional; existing user skill; multi-project on free org | SDK **beta**; default docs are Node; Replay ~36 KB gz extra; org-wide quota shared with SvelteKit; 1 user on Developer; 30-day retention; tunnel needed vs adblock |
| **PostHog** | Official RR7 framework + official Workers `posthog-node`; errors+analytics+replay+flags; generous free events; unlimited members; slim/lazy-load | 1 project on free; proxy recommended; default JS not tiny; self-host unsupported ops; `ssr.noExternal` Vite dance |
| **Cloudflare Observability** | Already enabled; no client bytes; OTel export (Paid); D1/fetch spans without SDK | No client issue UI; traces not on yet; Free 3-day logs; OTel export not on Workers Free; no replay/product analytics |
| **CF Web Analytics** | Free, no cookie, SPA route changes | No custom events; beacon adblocked; 10-site soft cap |
| **Plausible** | 2.5 KB gz; SPA; official CF proxy; privacy | Cloud not free after 30 days; no error tracking |
| **Umami** | Privacy, self-host free, SPA script | Cloud not forever-free (14-day trial then paid per FAQ on [pricing](https://umami.is/pricing)); no error APM |
| **Bugsnag** | First-party Workers + React | No RR framework guide; extra vendor vs existing Sentry |
| **GlitchTip** | Sentry SDK compatible; unlimited projects on $0 SaaS (1k events/mo) | No Workers docs; 1k events tiny; docs site 500 on fetch |
| **Highlight.io** | OSS + CF SDK folder in GitHub | Product site redirected to LaunchDarkly on fetch; treat docs as unavailable |
| **Axiom / Honeycomb / Grafana** | CF OTel destination; strong free ingest | Server traces/logs only unless you add a browser SDK; Grafana Free 14-day retention; OTel export needs Workers Paid |
| **OTel JS in-app** | Fan-out | Browser SDK experimental; Worker SDK redundant with CF native tracing |
| **Sentry + PostHog** | Best-in-class each | Two heavy clients; usually fails req 1 and 3 |

---

## 5. Free-tier snapshot (as of 2026-09-11 fetch)

| Vendor | Free / hobby (quoted) | Projects / orgs | Retention |
|--------|----------------------|-----------------|-----------|
| **Sentry Developer** | Free, **1 user**. Pricing grid: **50k errors**, **5M spans**, **50 replays**, **1 GB attachments**. Email alerts, 10 dashboards, MCP. | Unlimited projects **not capped** in docs. Quota is **per org**. Multiple orgs = separate subscriptions. | Developer: **30 days** errors/logs/spans/replays/attachments ([retention](https://docs.sentry.io/security-legal-pii/security/data-retention-periods/)) |
| **PostHog Cloud free** | **1M** analytics events, **5k** recordings, **1M** flag requests, **100k** exceptions, 1500 survey responses, 1M warehouse rows, … “resets monthly”. No card. Usage stops at limits (no surprise bill). | **1 project** free; PAYG raises to **6**. Unlimited team members. | **1 year** free; 7 years on PAYG |
| **CF Workers Logs** | Free plan: **200k log events/day**. Paid: 20M/mo included. | Per account / Worker | Free **3 days**; Paid **7 days** |
| **CF Workers traces** | Free in beta; billed **2026-10-01** on same event quota as logs | — | Same as logs when billed |
| **CF OTel export** | Beta free on **Workers Paid**; Free plan “Not available” | Destinations in dashboard | Per destination |
| **CF Web Analytics** | All plans | Soft **10 sites** | Unsampled 7 days; aggregates ~10%; UI **6 months** |
| **Plausible Cloud** | **30-day trial** (Business features), then paid. CE self-host: $0 software | Starter: 1 site | Per plan (not fully quoted on plans doc) |
| **Umami Cloud** | Signup free at cloud.umami.is; FAQ: **14-day trial** then billed; **self-host always free** | — | — |
| **GlitchTip SaaS Free** | **1,000 events/mo**, error tracking, **unlimited projects**, unlimited members | Unlimited projects | **Not specified** on homepage |
| **Axiom Personal** | $0: **500 GB/mo** load, 10 GB-hours query, 25 GB storage | Soft limits | **30 days** |
| **Honeycomb Free** | **20M events/mo**, 100M metrics points, 2 triggers | — | **Not specified** on pricing page fetch |
| **Grafana Cloud Free** | Docs/intro: **10k metrics, 50 GB logs, 50 GB traces**, 500 VUh k6; pricing page: 14-day retention, no charges | — | **14 days** |

---

## 6. Candidate tables

### 6.1 Sentry

| Criterion | Finding | Source URL |
|---|---|---|
| Official RR7/RR8 framework-mode SDK | **Yes.** `@sentry/react-router` (beta). Docs titled “React Router v7 Framework Mode”; npm peer `react-router` **7.x \|\| ^8.x**. Client: `entry.client.tsx` + `HydratedRouter`. Server Node path uses `instrumentations` (RR 7.15+). | https://docs.sentry.io/platforms/javascript/guides/react-router/ · https://www.npmjs.com/package/@sentry/react-router |
| Official Cloudflare Workers SDK | **Yes.** `@sentry/cloudflare` `withSentry` / Pages plugin / Vite plugin. `nodejs_compat` required (already on). Hydrogen documents RR framework on a Workers-like runtime with both packages. | https://docs.sentry.io/platforms/javascript/guides/cloudflare/ · https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen/ |
| Browser SDK gzip/min size | Replay **~36 KB gzip extra**. Errors-only npm gzip **not published**. Tree-shake Replay/tracing via not importing integrations + `bundleSizeOptimizations`. | https://docs.sentry.io/product/session-replay/web/performance-overhead/ · https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/ |
| Omit replay/flags/analytics | **Yes.** Integrations optional. Do not call `replayIntegration()`. | https://docs.sentry.io/platforms/javascript/guides/react-router/ |
| Server-side Worker without client | **Yes.** `@sentry/cloudflare` only in `workers/app.ts`. Client SDK only in `entry.client.tsx`. | https://docs.sentry.io/platforms/javascript/guides/cloudflare/ |
| Free tier | See §5. Developer: 1 user; pricing grid 50k/5M/50; 1 GB attachments. | https://sentry.io/pricing/ · https://docs.sentry.io/product/accounts/pricing/ |
| Second project / org | **Multiple projects allowed.** Quota org-wide. Multiple orgs = separate subscriptions. No “one free slot” text. | https://docs.sentry.io/organization/getting-started/ · https://docs.sentry.io/organization/data-storage-location/ |
| Replay / product analytics / errors / tracing | Errors, tracing (spans), Replay, logs, metrics, feedback. **Not** product analytics (funnels/autocapture). | https://docs.sentry.io/platforms/javascript/guides/react-router/ |
| Adblock / proxy | Optional `tunnel` to app endpoint. | https://docs.sentry.io/platforms/javascript/guides/react-router/manual-setup/ |
| Privacy | Default SDK sends IP/user/HTTP bodies; denylist filters `auth`/`password`. `dataCollection` to tighten. DPA/legal hub: https://docs.sentry.io/security-legal-pii/ | https://docs.sentry.io/platforms/javascript/guides/cloudflare/ |
| Self-host | sentry.io SaaS. Self-hosted Sentry exists historically; **not used as a source here** (self-hosted docs not fetched as a current product path). | — |

**Pros/cons:** see §4. For this app: use Hydrogen/Workers wrap, not Node wizard.

### 6.2 PostHog

| Criterion | Finding | Source URL |
|---|---|---|
| Official RR7/RR8 framework-mode | **Yes.** Dedicated RR7 framework-mode guide: `entry.client.tsx` + `PostHogProvider` + `HydratedRouter`; root `ErrorBoundary` `captureException`; server middleware + `posthog-node`. Remix page says Remix v3 **is** RR7 framework. RR **8** not named; **inference:** same framework files as 7. | https://posthog.com/docs/libraries/react-router/react-router-v7-framework-mode · https://posthog.com/docs/libraries/react-router · https://posthog.com/docs/libraries/remix |
| Official Cloudflare Workers | **Yes.** `posthog-node` **workerd** export; `waitUntil`; per-request client; RR7 `context.cloudflare.env`. | https://posthog.com/docs/libraries/cloudflare-workers |
| Browser SDK size | **Not published KB.** Lazy-load replay/surveys. `module.slim` + extension bundles (experimental). `module.no-external` drops extensions. | https://posthog.com/docs/libraries/js |
| Omit replay/flags/analytics | **Yes** via slim / no-external / not enabling exception autocapture / not loading recorder. | https://posthog.com/docs/libraries/js |
| Server without client | **Yes.** `posthog-node` in loaders/middleware only. | https://posthog.com/docs/libraries/cloudflare-workers |
| Free tier | 1M events, 5k replay, 100k exceptions, 1 project, 1y retention. | https://posthog.com/pricing |
| Second project / org | Free: **1 project**. PAYG: **6**. Orgs **not specified** as a free-plan cap. | https://posthog.com/pricing |
| Replay / analytics / errors / tracing | All four (product analytics, replay, error tracking, tracing headers to backend). Flags/experiments extra. | https://posthog.com/docs/error-tracking/installation/web · https://posthog.com/docs/libraries/js |
| Adblock / proxy | **Recommend reverse proxy.** Official CF Worker proxy (free CF plan). Managed proxy exists. | https://posthog.com/docs/advanced/proxy/cloudflare |
| Privacy | Tools for GDPR/CCPA/HIPAA; DPA on **any plan including free**; EU cloud; you decide what to collect. Cookies/identify used for product analytics. | https://posthog.com/docs/privacy |
| Self-host | MIT Docker hobby; **officially unsupported**; “you’ll probably be better off with Cloud”; paid features Cloud-only. **Out of scope** for this app. | https://posthog.com/docs/self-host |

### 6.3 Cloudflare native (Workers Observability + Web Analytics + Analytics Engine)

| Criterion | Finding | Source URL |
|---|---|---|
| Official RR7/RR8 framework-mode | **Not a framework SDK.** Logs/traces wrap the Worker regardless of RR. RR `handleError` still needed for caught loader errors that RR swallows. | https://developers.cloudflare.com/workers/observability/ · https://reactrouter.com/how-to/error-reporting |
| Official Workers | **Yes.** wrangler `observability`; this repo already enabled. | https://developers.cloudflare.com/workers/observability/logs/workers-logs/ |
| Browser SDK size | Observability: **0**. Web Analytics beacon: size **unpublished**. | https://developers.cloudflare.com/web-analytics/faq/ |
| Omit replay/flags | N/A (none of those). | — |
| Server without client | **Yes** (the whole product). | https://developers.cloudflare.com/workers/observability/ |
| Free tier | Logs 200k/day, 3-day retention (Free). Traces beta free until 2026-10-01. Web Analytics free. Analytics Engine: separate product (pricing not fully fetched). | https://developers.cloudflare.com/workers/observability/logs/workers-logs/ · https://developers.cloudflare.com/workers/observability/traces/ |
| Second project / org | Per CF account / Worker. | — |
| Replay / analytics / errors / tracing | Logs + (opt-in) traces + exceptions. **No** session replay. Web Analytics = privacy RUM, **no** custom product events. Analytics Engine = custom high-cardinality events from Worker. | https://developers.cloudflare.com/web-analytics/faq/ · https://developers.cloudflare.com/analytics/analytics-engine/ |
| Adblock | Workers Logs: no. Web Analytics beacon: **blocked** by common blockers. | https://developers.cloudflare.com/web-analytics/faq/ |
| Privacy | Web Analytics: no cookie, designed not to collect PII; no query strings. Workers Logs: whatever you `console.log` (this app should not log secrets). | https://developers.cloudflare.com/web-analytics/ |
| Self-host | N/A (platform). | — |

### 6.4 Highlight.io

| Criterion | Finding | Source URL |
|---|---|---|
| RR framework | **Not verified.** highlight.io docs URLs redirected to LaunchDarkly on 2026-09-11 fetch. GitHub README still describes session replay, errors, logs, traces, client SDK. | https://github.com/highlight/highlight |
| Cloudflare Workers | GitHub tree includes `sdk/highlight-cloudflare` (README empty in fetch). **Cannot confirm current first-party docs.** | https://github.com/highlight/highlight |
| Bundle | **Not published** on remaining GitHub README. | — |
| Free / self-host | README: hosted “free to get started”; hobby Docker; enterprise self-host. Limits “Good for <10k sessions and <50k errors” on hobby. | https://raw.githubusercontent.com/highlight/highlight/main/README.md |

**Verdict for this app:** not a serious candidate until first-party docs are reachable.

### 6.5 GlitchTip

| Criterion | Finding | Source URL |
|---|---|---|
| RR / Workers | Uses **Sentry client SDKs**. No first-party RR or Workers guide found. `docs.glitchtip.com` returned **500**; GitLab wiki empty. | https://glitchtip.com/ |
| Free SaaS | **1,000 events/mo**, unlimited projects, unlimited members. Next listed tier 100k events (price not parsed as $0 vs paid in fetch — page lists “Free ($0)” then “For small teams”). | https://glitchtip.com/ |
| Self-host | OSS; “run it on your server, or let us host.” | https://glitchtip.com/ |

**1k events/mo is too small** for combined client+server if anything noisy. Could ingest via Sentry SDK **if** the DSN points at GlitchTip — **inference, not specified** for Workers.

### 6.6 Bugsnag

| Criterion | Finding | Source URL |
|---|---|---|
| RR framework | **No.** React `ErrorBoundary` plugin + generic JS. | https://docs.bugsnag.com/platforms/javascript/react/ |
| Cloudflare Workers | **Yes first-party.** `@bugsnag/plugin-cloudflare-workers`, wrap `fetch`, `nodejs_compat`, session per invocation. | https://docs.bugsnag.com/platforms/javascript/cloudflare-workers/ |
| Bundle | **Not published.** | — |
| Free tier | **Not fetched** (pricing page not in method list). | — |

Serious only if abandoning Sentry; still need custom RR `handleError` / `onError` glue.

### 6.7 Rollbar

No first-party Cloudflare Workers guide in [Rollbar JS](https://docs.rollbar.com/docs/javascript) (browser, Node, Lambda, React). **No first-party Workers path found.** Skip.

### 6.8 Axiom

| Criterion | Finding | Source URL |
|---|---|---|
| RR | **No.** OTel backend. | https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/ |
| Workers | **Yes** as CF OTel destination (`https://api.axiom.co/v1/traces` and `/logs`). | same |
| Browser SDK | Not a lean product-analytics SDK. | — |
| Free | Personal **$0**: 500 GB/mo load, 10 GB-hours, 25 GB storage, 30-day retention. | https://axiom.co/pricing |
| Replay / product analytics | Logs/traces/events store. **Not** session replay / product analytics. | — |

Fits **OTEL exporter from Worker, no browser SDK** hybrid. Needs **Workers Paid** for CF OTel export.

### 6.9 Honeycomb

| Criterion | Finding | Source URL |
|---|---|---|
| Workers | CF OTel destination. | https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/ |
| Free | **20M events/mo**, 100M metrics points, 2 triggers, OTel support. | https://www.honeycomb.io/pricing |
| RR / browser / replay | Tracing backend. Frontend analysis is an Enterprise add-on on the pricing page. | https://www.honeycomb.io/pricing |

Same hybrid as Axiom. No RR framework SDK.

### 6.10 Grafana Cloud / Tempo / Loki

| Criterion | Finding | Source URL |
|---|---|---|
| Workers | CF OTel destination (Grafana Cloud OTLP gateway). | https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/ |
| Free | Forever free: **10k metrics, 50 GB logs, 50 GB traces** ([intro docs](https://grafana.com/docs/grafana/latest/introduction/grafana-cloud/)); **14-day** retention ([pricing](https://grafana.com/pricing/)). |
| Browser | Far-OTel / Grafana Faro not fetched as RR-specific. **Inference:** extra client SDK if you want RUM. |

Good **server-only** sink if this account is Workers Paid. Not a product-analytics tool.

### 6.11 OpenTelemetry JS

| Criterion | Finding | Source URL |
|---|---|---|
| Workers | **Prefer CF native tracing** (no `@opentelemetry/*` in the Worker). CF emits OTel to backends. In-process `@opentelemetry/sdk-*` on Workers: **not specified** as supported in CF docs fetched; this repo’s `@opentelemetry/core` override is transitive only. | https://developers.cloudflare.com/workers/observability/traces/ |
| Browser | **Experimental**, “mostly unspecified.” Needs `@opentelemetry/sdk-trace-web` + instrumentations. Size unpublished. | https://opentelemetry.io/docs/languages/js/getting-started/browser/ |
| Fan-out | Yes, to Axiom/Honeycomb/Grafana/Sentry OTLP. Sentry listed as CF OTel traces+logs dest. | https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/ |

**Do not add browser OTel** if lean is the goal. **Do not add Worker OTel SDK** when wrangler traces exist.

### 6.12 Plausible

| Criterion | Finding | Source URL |
|---|---|---|
| RR framework | **Client-only.** SPA `pushState` automatic. Hash routing needs extra script. | https://plausible.io/docs/spa-support |
| Cloudflare | Official Worker reverse proxy; 100k req/day free Workers mention. Optional subdirectory route. | https://plausible.io/docs/proxy/guides/cloudflare |
| Size | **2.5 KB gzipped** | https://plausible.io/lightweight-web-analytics |
| Omit products | Analytics only (no errors/replay). | — |
| Server without client | Events API exists (docs mention; not fully fetched). | https://plausible.io/docs/plausible-script |
| Free | **30-day trial**, then paid. CE self-host $0 software. Hosted is “not the right fit if you need free hosted analytics forever.” | https://plausible.io/docs/trial · https://plausible.io/when-not-to-use-plausible |
| SPA / hash | SPA yes; hash needs hash tracker. RR8 framework uses history API, **not** hash (**inference** from this app’s `Link` / path routes). | https://plausible.io/docs/spa-support |
| Privacy | No cookies, no personal data, no consent banner (vendor position). | https://plausible.io/lightweight-web-analytics |
| Self-host | Plausible CE, AGPL. | https://plausible.io/self-hosted-web-analytics |

### 6.13 Umami

| Criterion | Finding | Source URL |
|---|---|---|
| RR | Client script; SPA/custom events in product description. **No RR framework guide fetched.** | https://umami.is/docs |
| Cloudflare | **Not specified** in fetched docs. |
| Size | **Not published.** | — |
| Free | Self-host **always free**. Cloud: usage-based; FAQ **14-day trial** then billed. Meta: “Start free, scale as you grow.” | https://umami.is/docs/cloud · https://umami.is/pricing |
| Privacy | No cookies, no PII, GDPR/CCPA (vendor). | https://umami.is/pricing (FAQ JSON-LD) |
| Replay | Product lists session replay/heatmaps (v3 docs intro). | https://umami.is/docs |

### 6.14 Mixpanel / Amplitude / Tinybird

- **Amplitude:** `@amplitude/analytics-node` **incompatible** with Workers (`node:http`). HTTP API is the documented Workers path ([Agent Analytics SDK](https://amplitude.com/docs/sdks/agent-analytics/sdk)). Browser SDK is a full product-analytics bundle — **heavy / no Workers SDK**.
- **Mixpanel:** no first-party Workers SDK found in this pass.
- **Tinybird:** analytics backend, not a lean RR browser SDK.

**Brief:** skip for this app’s lean + Workers constraints.

---

## 7. Hybrid splits (errors vs analytics)

| Split | Client bytes | Server | Free-tier fit | Gap |
|-------|--------------|--------|---------------|-----|
| **CF Observability + Plausible** | ~2.5 KB gz | Worker logs (already) | CF logs free; Plausible trial then pay | No grouped client issues |
| **CF Observability + CF Web Analytics** | beacon (size unknown) | Worker logs | Both free | No custom events; beacon adblocked; no issue tracker |
| **CF Observability + PostHog slim** | PostHog slim (KB unknown) | logs + optional `posthog-node` | PostHog 1M events / 100k exceptions | Still a JS SDK; 1 project |
| **Sentry errors-only + Plausible** | Sentry errors (unknown) + 2.5 KB | `@sentry/cloudflare` | Sentry 50k errors shared with SvelteKit; Plausible paid after trial | Two vendors; two requests |
| **Sentry-only** (no replay) | Sentry errors ± tracing | `@sentry/cloudflare` | Shared org quota | No product analytics |
| **PostHog-only** | posthog-js (lazy extras) | `posthog-node` workerd | Generous events; 1 project | Heavier than Plausible; proxy |
| **Sentry + PostHog full** | **Usually too heavy** | both | Burns both quotas | Fails req 1 and 3 |
| **OTel from Worker only** (Axiom/Honeycomb/Grafana/Sentry OTLP) | **0** | CF traces+logs export | Grafana 50 GB; Honeycomb 20M; Axiom 500 GB; needs **Workers Paid** | No client errors, no product analytics |
| **CF Analytics Engine from `handleError`** | 0 if only server | custom SQL events | Extra CF product | DIY dashboards; no client unless you POST |

**Best hybrids for stated ranking:** (1) CF logs + Sentry errors-only second project; analytics later via Plausible or CF Web Analytics. (2) If Sentry must stay off this org: CF logs + PostHog slim **or** CF logs + Plausible.

---

## 8. React Router reporting hooks (this tree)

Documented hooks this app **already has files for**:

- `app/entry.client.tsx` — add `HydratedRouter onError` ([error reporting](https://reactrouter.com/how-to/error-reporting)). Sentry: `Sentry.sentryOnError`. PostHog: still use root `ErrorBoundary` `captureException` as in their guide.
- `app/entry.server.tsx` — add `export const handleError` so loader/action throws that RR catches are reported (today only `onError` on the React stream logs after shell render).
- `app/root.tsx` `ErrorBoundary` — UI only unless it calls `captureException` (Sentry npm README; PostHog RR7 guide).
- Optional `clientMiddleware` — pageview/timing on client navigations (`docs/react-router-audit.md`, [middleware](https://reactrouter.com/how-to/middleware)). Plausible/CF Web Analytics claim they already hook `pushState`, so middleware may be redundant for pageviews.

RR production **sanitizes server Error** before sending to the browser ([error boundary](https://reactrouter.com/how-to/error-boundary)) — report on the **server** `handleError`, not only in the client boundary.

---

## 9. Gaps / fetch failures (labeled)

- `https://posthog.com/docs/libraries/cloudflare` → **404**; real page is `/docs/libraries/cloudflare-workers`.
- `https://plausible.io/docs` and `/pricing` → **409 / 404**; used `/docs/plausible-script`, `/docs/subscription-plans`, `/docs/trial`.
- `https://plausible.io/docs/script-size` → **404**; size from `/lightweight-web-analytics`.
- `https://www.highlight.io/docs/...` → **LaunchDarkly marketing page**.
- `https://docs.glitchtip.com/` → **500**.
- `https://docs.sentry.io/platforms/javascript/session-replay/performance-overhead/` → **404**. Replay **~36 KB gzip** figure is on https://docs.sentry.io/product/session-replay/web/performance-overhead/ (fetched 2026-09-11; still cites SDK 7.78.0).
- Sentry legal DPA URL guessed → **404**; hub: https://docs.sentry.io/security-legal-pii/
- Grafana Cloud Free **50 GB logs/traces** from [intro docs](https://grafana.com/docs/grafana/latest/introduction/grafana-cloud/) and signup copy; [pricing](https://grafana.com/pricing/) Free column is less numeric (says “limited usage”).
- Developer vs paid **50k errors**: grid on sentry.io/pricing vs docs sentence that lists those volumes under **paid** plans — treat Developer 50k as **from the public pricing grid**, confirm in org Settings → Subscription.
- Second Developer org: **inference, not specified** that the product always allows creating another free org.
- `@sentry/react-router` vs RR **8.3.1**: peer allows `^8.x`; docs still say v7. Combo with Vite 8 / React 19.3 **not specified**.
- Hydrogen “do not import `@sentry/cloudflare` except `/request`” is **Oxygen-specific**; Workers guide uses `withSentry` from `@sentry/cloudflare`.

---

## 10. Sources (primary)

All URLs in **Method** plus this repo: `package.json`, `wrangler.jsonc`, `workers/app.ts`, `app/entry.client.tsx`, `app/entry.server.tsx`, `app/root.tsx`, `react-router.config.ts`, `docs/react-router-audit.md`.

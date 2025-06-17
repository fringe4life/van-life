import {
  type RouteConfig,
  index,
  layout,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  route("/api/auth/*", "routes/api/auth.ts"),
  layout("layout/layout.tsx", [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    ...prefix("vans", [
      index("./routes/vans.tsx"),
      route(":vanId", "./routes/van.tsx"),
    ]),
    route("login", "./routes/login.tsx"),
    route("signup", "./routes/signUp.tsx"),
    layout("layout/hostLayout.tsx", [
      ...prefix("host", [
        index("./routes/host/host.tsx"),
        route("income", "./routes/host/income.tsx"),
        route("review", "./routes/host/reviews.tsx"),
      ]),
    ]),
    route("*", "./routes/404.tsx"),
  ]),
] satisfies RouteConfig;

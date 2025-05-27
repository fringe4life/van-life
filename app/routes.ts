import {
  type RouteConfig,
  index,
  layout,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("layout/layout.tsx", [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    ...prefix("vans", [
      index("./routes/vans.tsx"),
      route(":vanId", "./routes/van.tsx"),
    ]),
    route("*", "./routes/404.tsx"),
  ]),
] satisfies RouteConfig;

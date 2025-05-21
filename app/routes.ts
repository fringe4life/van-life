import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("vans", "routes/vans.tsx"),
  route("vans/:vanId", "routes/van.tsx"),
] satisfies RouteConfig;

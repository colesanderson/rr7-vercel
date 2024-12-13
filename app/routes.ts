import {
  index,
  route,
  layout,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("layout/main.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("search", "routes/search/index.tsx", [
      route("list", "routes/search/list/index.tsx"),
      route("list/:id", "routes/search/list/[id].tsx"),
    ]),
  ]),
] as RouteConfig;

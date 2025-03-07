import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  ...prefix("recipes", [
    index("routes/recipes.tsx"),
    route("new", "routes/recipes-new.tsx"),
  ]),
] satisfies RouteConfig;

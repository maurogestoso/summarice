import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in/*", "routes/sign-in.tsx"),
  route("sign-up/*", "routes/sign-up.tsx"),
  route("account", "routes/account.tsx"),
  ...prefix("recipes", [
    index("routes/recipes.tsx"),
    route("new", "routes/recipes-new.tsx"),
    route(":id/edit", "routes/recipes-edit.tsx"),
    route(":recipeId", "routes/recipes-detail.tsx"),
  ]),
  ...prefix("api", [route("webhooks", "routes/api/webhooks.ts")]),
] satisfies RouteConfig;

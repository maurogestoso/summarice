import { SignedIn, RedirectToSignIn, SignedOut } from "@clerk/react-router";
import type { Route } from "./+types/recipes";
import { Link } from "react-router";
import { db } from "~/db";
import { recipe } from "~/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/react-router/ssr.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Recipes" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader(loaderArgs: Route.LoaderArgs) {
  const auth = await getAuth(loaderArgs);
  const recipes = await db
    .select()
    .from(recipe)
    .where(eq(recipe.userId, auth.userId!));

  console.log("🚀 ~ loader ~ recipes:", recipes);

  return { recipes };
}

export default function RecipesPage() {
  return (
    <>
      <SignedIn>
        <h1>Recipes Page</h1>
        <Link to={"/recipes/new"}>Add +</Link>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

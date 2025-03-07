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

export default function RecipesPage({ loaderData }: Route.ComponentProps) {
  const { recipes } = loaderData;
  return (
    <>
      <SignedIn>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Recipes</h2>
          <Link className="bg-green-600 p-2 rounded-lg" to={"/recipes/new"}>
            Add +
          </Link>
        </div>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} className="mb-1">
              <Link
                className="underline text-blue-500"
                to={`/recipes/${recipe.id}`}
              >
                {recipe.data?.title}
              </Link>
            </li>
          ))}
        </ul>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

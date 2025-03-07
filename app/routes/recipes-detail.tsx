import { db } from "~/db";
import type { Route } from "./+types/recipes-detail";
import { getAuth } from "@clerk/react-router/ssr.server";
import { recipe as $recipe } from "~/db/schema";
import { and, eq } from "drizzle-orm";
import { Link } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const { recipeId } = args.params;
  const { userId } = await getAuth(args);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const result = await db
    .select()
    .from($recipe)
    .where(and(eq($recipe.id, parseInt(recipeId)), eq($recipe.userId, userId)));
  const recipe = result.at(0);
  if (!result.length || !recipe) {
    throw new Response("Not found", { status: 404 });
  }
  return { recipe };
}

export default function RecipesDetail({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <nav className="mb-2">
        <Link to="/recipes" className="underline text-blue-500">
          {"<- Back to recipes"}
        </Link>
      </nav>
      <h2 className="font-bold text-xl mb-2">
        {loaderData.recipe.data?.title}
      </h2>
      <h3 className="font-bold text-lg">Ingredients</h3>
      <ul className="list-disc list-inside mb-2">
        {loaderData.recipe.data?.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3 className="font-bold text-lg">Instructions</h3>
      <ol className="list-decimal list-inside">
        {loaderData.recipe.data?.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </>
  );
}

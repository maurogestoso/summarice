import { Link, redirect, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/recipes-new";
import { z } from "zod";
import { fetchRecipe } from "~/lib/dom";
import { summariseRecipe } from "~/lib/ai";
import { db } from "~/db";
import { recipe } from "~/db/schema";
import { getAuth } from "@clerk/react-router/ssr.server";

const formSchema = z.object({
  recipeUrl: z.string(),
});

export async function action(loaderArgs: Route.ActionArgs) {
  let formData = await loaderArgs.request.formData();
  let { recipeUrl } = formSchema.parse({
    recipeUrl: formData.get("recipe_url"),
  });

  const auth = await getAuth(loaderArgs);
  let { textContent, title } = await fetchRecipe(recipeUrl);
  if (!textContent) {
    throw new Error("No recipe content found");
  }

  let recipeSummary = await summariseRecipe(textContent);
  if (!recipeSummary) {
    throw new Error("No recipe summary found");
  }
  console.log("🚀 ~ action ~ recipeSummary:", recipeSummary);

  await db.insert(recipe).values({
    userId: auth.userId!,
    title: title ?? "Untitled Recipe",
    url: recipeUrl,
    aiSummary: {
      ingredients: recipeSummary.ingredients,
      instructions: recipeSummary.instructions,
    },
  });

  const response = redirect("/recipes");
  console.log("🚀 ~ action ~ response:", response);
  return response;
}

export default function RecipesNew({}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <>
      <nav className="mb-2">
        <Link to="/recipes" className="underline text-blue-500">
          {"<- Back to recipes"}
        </Link>
      </nav>
      <fetcher.Form method="post">
        <textarea
          className="border border-gray-400 p-2 rounded-lg w-full"
          name="recipe_url"
          placeholder="Paste recipe URL..."
          rows={4}
        />
        <button
          className="bg-green-600 rounded-lg p-2 w-full font-semibold disabled:bg-gray-500"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </fetcher.Form>
    </>
  );
}

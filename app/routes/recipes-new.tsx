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
      <nav className="mb-4">
        <Link to="/recipes" className="link link-secondary">
          {"<- Back to recipes"}
        </Link>
      </nav>
      <fetcher.Form method="post">
        <textarea
          className="textarea textarea-primary w-full mb-2"
          name="recipe_url"
          placeholder="Paste recipe URL..."
          rows={4}
          autoFocus
          required
        />
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <> <span className="loading loading-spinner"></span> Adding...
            </> : "Add"}
        </button>
      </fetcher.Form>
    </>
  );
}

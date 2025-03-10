import React from "react";
import { db } from "~/db";
import type { Route } from "./+types/recipes-detail";
import { getAuth } from "@clerk/react-router/ssr.server";
import { recipe as $recipe, recipe } from "~/db/schema";
import { and, eq } from "drizzle-orm";
import { Form, Link, redirect } from "react-router";

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

export async function action(args: Route.ActionArgs) {
  const { recipeId } = args.params;
  const { userId } = await getAuth(args);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (args.request.method === "DELETE") {
    await db
      .delete(recipe)
      .where(and(
        eq(recipe.id, parseInt(recipeId)), 
        eq(recipe.userId, userId))
      );
    return redirect("/recipes");
  }
}

export default function RecipesDetail({ loaderData }: Route.ComponentProps) {
  const { recipe } = loaderData;

  return (
    <>
      <nav className="mb-4 flex justify-between items-center">
        <Link to="/recipes" className="link link-secondary">
          {"<- Back to recipes"}
        </Link>
        <button 
          className="btn btn-primary w-20" 
          popoverTarget="popover-1" 
          style={{ anchorName: "--anchor-1" } as React.CSSProperties}
        >
          Actions
        </button>

        <ul 
          className="dropdown dropdown-end menu rounded-box bg-base-100 shadow-sm w-24"
          popover="auto" 
          id="popover-1" 
          style={{ positionAnchor: "--anchor-1" } as React.CSSProperties }
        >
          <li>
            <Form method="delete" action={`/recipes/${recipe.id}`}>
              <button className="btn btn-sm btn-soft btn-error" type="submit">Delete</button>
            </Form>
          </li>
        </ul>
      </nav>
      <h2 className="font-bold text-2xl mb-1">{recipe.title}</h2>
      <div className="mb-4">
        <span className="text-sm">
          🔗
          <a 
            href={recipe.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link link-secondary ml-1"
          >
            Original recipe
          </a>
        </span>
        
      </div>
      <h3 className="font-bold text-lg">Ingredients</h3>
      <ul className="list-disc list-inside mb-2">
        {recipe.aiSummary?.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3 className="font-bold text-lg">Instructions</h3>
      <ol className="list-decimal list-inside">
        {recipe.aiSummary?.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </>
  );
}


import { getAuth } from "@clerk/react-router/ssr.server";
import { and, eq } from "drizzle-orm";
import { Form, Link, redirect } from "react-router";
import { db } from "~/db";
import { recipe as $recipe } from "~/db/schema";
import type { Route } from "./+types/recipes-edit";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const result = await db
    .select()
    .from($recipe)
    .where(and(
      eq($recipe.id, parseInt(args.params.id)), 
      eq($recipe.userId, userId)
    ));
  
  const recipe = result.at(0);
  if (!result.length || !recipe) {
    throw new Response("Not found", { status: 404 });
  }
  
  return { recipe };
}

export async function action(args: Route.ActionArgs) {
  const { userId } = await getAuth(args);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (args.request.method === "PUT") {
    const formData = await args.request.formData();
    const title = formData.get("title");

    if (!title || typeof title !== "string") {
      throw new Error("Title is required");
    }

    await db
      .update($recipe)
      .set({ title })
      .where(and(eq($recipe.id, parseInt(args.params.id)), eq($recipe.userId, userId)));
    
    return redirect(`/recipes/${args.params.id}`);
  }
}

export default function EditRecipe({ loaderData }: Route.ComponentProps) {
  const { recipe } = loaderData;

  return (
    <>
      <nav className="mb-4">
        <Link to={`/recipes/${recipe.id}`} className="link link-secondary">
          {"<- Back to recipe"}
        </Link>
      </nav>
      <h2 className="font-bold text-2xl mb-4">Edit Recipe</h2>
      <Form method="put" className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={recipe.title}
            className="input input-bordered w-full"
            required 
            autoFocus
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </Form>
    </>
  );
} 
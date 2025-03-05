import type { Route } from "./+types/home";
import { db } from "~/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Recipes" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const result = await db.run("SELECT 1");
  console.log("🚀 ~ loader ~ result:", result);
}

export default function RecipesPage() {
  return (
    <>
      <h1>Recipes Page</h1>
    </>
  );
}

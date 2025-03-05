import { SignedIn, RedirectToSignIn, SignedOut } from "@clerk/react-router";
import type { Route } from "./+types/recipes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Recipes" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function RecipesPage() {
  return (
    <>
      <SignedIn>
        <h1>Recipes Page</h1>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

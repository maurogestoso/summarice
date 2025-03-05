import { SignIn } from "@clerk/react-router";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign in" },
    { name: "description", content: "Sign in page" },
  ];
}

export default function SignInPage() {
  return (
    <>
      <h1>Sign In Page</h1>
      <SignIn />
    </>
  );
}

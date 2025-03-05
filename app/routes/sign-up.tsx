import { SignUp } from "@clerk/react-router";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign up" },
    { name: "description", content: "Sign up page" },
  ];
}

export default function SignUpPage() {
  return (
    <>
      <h1>Sign Up Page</h1>
      <SignUp />
    </>
  );
}

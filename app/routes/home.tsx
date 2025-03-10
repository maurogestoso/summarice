import { Waitlist } from "@clerk/react-router";
import type { Route } from "./+types/home";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const auth = await getAuth(args);
  if (auth.userId) {
    return redirect("/recipes");
  }
}

export default function Home() {
  
  return (
    <>
      <Waitlist />
    </>
  );
}

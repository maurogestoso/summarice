import type { Route } from "./+types/home";
import { db } from "~/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const result = await db.run("SELECT 1");
  console.log("🚀 ~ loader ~ result:", result);
}

export default function Home() {
  return (
    <>
      <h1>Home Page</h1>
    </>
  );
}

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function fetchRecipe(url: string) {
  // TODO: handle errors
  const recipeResponse = await fetch(url);
  const recipeText = await recipeResponse.text();
  const document = new JSDOM(recipeText);
  const reader = new Readability(document.window.document);
  const article = reader.parse();
  if (!article) throw new Error("Could not parse article");

  return article;
}

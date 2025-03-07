import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
  role: "system",
  content: `
    You are a friendly, helpful assistant tasked with summarising cooking recipes. When a user asks you to summarise a recipe, you should return a JSON object with the following fields:
    - 'ingredients': a detailed list of ingredients as an array of strings
    - 'instructions': a step-by-step summary of the recipe as an array of strings
  `,
};

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const RecipeSummarySchema = z.object({
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

type RecipeSummary = z.infer<typeof RecipeSummarySchema>;

async function aiSummariseRecipe(recipe: string) {
  const completion = await client.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      systemPrompt,
      { role: "user", content: `Summarise this recipe: ${recipe}` },
    ],
    response_format: zodResponseFormat(RecipeSummarySchema, "recipe_summary"),
  });
  return completion.choices[0].message.parsed;
}

async function mockSummariseRecipe(
  recipe: string
): Promise<RecipeSummary | null> {
  return {
    ingredients: [
      "500g white flour",
      "400ml water",
      "10g salt",
      "100g sourdough starter",
    ],
    instructions: [
      "Mix starter with water",
      "Add flour and salt",
      "Knead",
      "Rest for 12 hours",
      "Bake at 200C for 30 minutes",
    ],
  };
}

export const summariseRecipe =
  process.env.NODE_ENV === "production"
    ? aiSummariseRecipe
    : mockSummariseRecipe;

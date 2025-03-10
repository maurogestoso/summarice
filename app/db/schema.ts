import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export let recipe = sqliteTable(
  "recipe",
  {
    id: integer("id").primaryKey(),
    userId: text("userId").references(() => user.id),
    title: text("title").notNull(),
    url: text("url").notNull(),
    aiSummary: text({ mode: "json" }).$type<{
      ingredients: string[];
      instructions: string[];
    }>(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("userId_idx").on(table.userId)]
);

export let user = sqliteTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

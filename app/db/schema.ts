import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export let recipe = sqliteTable(
  "recipe",
  {
    id: integer("id").primaryKey(),
    userId: text("userId").references(() => user.id),
    data: text({ mode: "json" }).$type<{
      title: string;
      ingredients: string[];
      instructions: string[];
    }>(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("userId_idx").on(table.userId)]
);

export let user = sqliteTable("user", {
  id: text("id").primaryKey(),
});

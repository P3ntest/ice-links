import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const linksTable = pgTable("links", {
  path: varchar({ length: 255 }).notNull().primaryKey().unique(),
  target: text().notNull(),
  extUserId: varchar({ length: 64 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

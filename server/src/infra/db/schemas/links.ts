import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const links = pgTable("links", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4()),
	originalUrl: text("original_url").notNull(),
	shortUrl: text("short_url").notNull().unique(),
	accessCount: integer("access_count").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

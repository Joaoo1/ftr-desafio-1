import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeRight } from "@/shared/either";
import { desc } from "drizzle-orm";

type ListLinksOutput = {
	links: {
		id: string;
		originalUrl: string;
		shortUrl: string;
		accessCount: number;
	}[];
};

export async function listLinks(): Promise<Either<null, ListLinksOutput>> {
	const links = await db
		.select({
			id: schema.links.id,
			originalUrl: schema.links.originalUrl,
			shortUrl: schema.links.shortUrl,
			accessCount: schema.links.accessCount,
		})
		.from(schema.links)
		.orderBy(desc(schema.links.createdAt));

	return makeRight({ links });
}

import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";

type GetLinkOutput = {
	link: {
		originalUrl: string;
		shortUrl: string;
	};
};

export async function getLink(
	shortUrl: string,
): Promise<Either<null, GetLinkOutput>> {
	const [link] = await db
		.select({
			id: schema.links.id,
			originalUrl: schema.links.originalUrl,
			shortUrl: schema.links.shortUrl,
			accessCount: schema.links.accessCount,
		})
		.from(schema.links)
		.where(eq(schema.links.shortUrl, shortUrl));

	if (!link) {
		return makeLeft(null);
	}

	await db
		.update(schema.links)
		.set({ accessCount: link.accessCount + 1 })
		.where(eq(schema.links.id, link.id));

	return makeRight({
		link: {
			originalUrl: link.originalUrl,
			shortUrl: link.shortUrl,
		},
	});
}

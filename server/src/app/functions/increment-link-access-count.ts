import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";

type IncrementLinkAccessCountOutput = {
	success: boolean;
};

export async function incrementLinkAccessCount(
	shortUrl: string,
): Promise<Either<Error, IncrementLinkAccessCountOutput>> {
	try {
		const [link] = await db
			.select({
				id: schema.links.id,
				accessCount: schema.links.accessCount,
			})
			.from(schema.links)
			.where(eq(schema.links.shortUrl, shortUrl));

		if (!link) {
			return makeLeft(new Error("Link not found."));
		}

		await db
			.update(schema.links)
			.set({ accessCount: link.accessCount + 1 })
			.where(eq(schema.links.id, link.id));

		return makeRight({ success: true });
	} catch (error) {
		return makeLeft(new Error("Failed to increment link access count."));
	}
}

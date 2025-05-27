import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { eq } from "drizzle-orm";

export async function removeLink(
	shortLink: string,
): Promise<Either<{ message: string }, { message: string }>> {
	try {
		const [link] = await db
			.select({ id: schema.links.id })
			.from(schema.links)
			.where(eq(schema.links.shortUrl, shortLink));

		if (!link) {
			return makeLeft({ message: "Link encurtado informado não existe." });
		}

		await db.delete(schema.links).where(eq(schema.links.shortUrl, shortLink));

		return makeRight({ message: `Link "${shortLink}" deletado com sucesso!` });
	} catch (error) {
		return makeLeft({ message: "Não foi possível deletar o link." });
	}
}

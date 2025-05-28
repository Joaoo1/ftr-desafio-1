import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import type { PostgresError } from "postgres";
import { z } from "zod";

export const createLinkSchema = z.object({
	originalUrl: z.string().url("URL original deve ser uma URL válida."),
	shortUrl: z.string().min(3).max(100),
});

type CreateLinkInput = z.input<typeof createLinkSchema>;

export async function createLink({
	originalUrl,
	shortUrl,
}: CreateLinkInput): Promise<
	Either<
		{ message: string },
		{
			id: string;
			originalUrl: string;
			shortUrl: string;
			accessCount: number;
			createdAt: Date;
		}
	>
> {
	try {
		const [link] = await db
			.insert(schema.links)
			.values({ originalUrl, shortUrl })
			.returning();

		if (!link) {
			return makeLeft({
				message: "Erro ao inserir o link. Nenhum dado retornado.",
			});
		}

		return makeRight({
			id: link.id,
			originalUrl: link.originalUrl,
			shortUrl: link.shortUrl,
			accessCount: link.accessCount,
			createdAt: link.createdAt,
		});
	} catch (err: unknown) {
		const error = err as PostgresError;

		const violateUniqueConstraint = error.code === "23505";
		if (
			violateUniqueConstraint &&
			error.constraint_name === "links_short_url_unique"
		) {
			return makeLeft({ message: `O link encurtado "${shortUrl}" já existe.` });
		}

		return makeLeft({
			message: "Erro inesperado ao criar o link. Tente novamente mais tarde.",
		});
	}
}

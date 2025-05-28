import { createLink, createLinkSchema } from "@/app/functions/create-link";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/links",
		{
			schema: {
				summary: "Save a new link",
				tags: ["links"],
				body: createLinkSchema,
				response: {
					201: z.object({
						id: z.string(),
						originalUrl: z.string(),
						shortUrl: z.string(),
						accessCount: z.number(),
						createdAt: z.date(),
					}),
					400: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const data = request.body;

			if (!data.originalUrl) {
				return reply
					.status(400)
					.send({ message: "O link original é obrigatório." });
			}

			if (!data.shortUrl) {
				return reply
					.status(400)
					.send({ message: "O link encurtado é obrigatório." });
			}

			if (data.shortUrl === "links" || data.shortUrl === "not-found") {
				return reply.status(400).send({
					message: `O link encurtado  "${data.shortUrl}" é restrito.`,
				});
			}

			if (!data.originalUrl.startsWith("https://")) {
				data.originalUrl = `https://${data.originalUrl}`;
			}

			const result = await createLink({
				originalUrl: data.originalUrl,
				shortUrl: data.shortUrl,
			});

			if (isRight(result)) {
				const { id, originalUrl, shortUrl, accessCount, createdAt } =
					unwrapEither(result);
				return reply
					.status(201)
					.send({ id, originalUrl, shortUrl, accessCount, createdAt });
			}

			const error = unwrapEither(result);

			return reply.status(400).send({ message: error.message });
		},
	);
};

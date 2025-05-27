import { incrementLinkAccessCount } from "@/app/functions/increment-link-access-count";
import { isLeft } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const incrementLinkAccessCountRoute: FastifyPluginAsyncZod = async (
	app,
) => {
	app.patch(
		"/links/:shortUrl/access",
		{
			schema: {
				summary: "Increment the access count of a link",
				tags: ["links"],
				params: z.object({
					shortUrl: z.string(),
				}),
				response: {
					200: z.object({
						success: z.boolean(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const paramsSchema = z.object({
				shortUrl: z.string(),
			});

			const { shortUrl } = paramsSchema.parse(request.params);

			const result = await incrementLinkAccessCount(shortUrl);

			if (isLeft(result)) {
				const error = result.left;
				if (error.message === "Link não encontrado.") {
					return reply.status(404).send({ message: error.message });
				}
				return reply.status(500).send({ message: "Erro interno do servidor." });
			}

			return reply.status(200).send(result.right);
		},
	);
};

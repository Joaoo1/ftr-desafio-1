import { getLink } from "@/app/functions/get-link";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getLinkRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/:shortUrl",
		{
			schema: {
				summary: "Get link",
				tags: ["links"],
				response: {
					200: z.object({
						link: z.object({
							originalUrl: z.string(),
							shortUrl: z.string(),
						}),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { shortUrl } = request.params as { shortUrl: string };
			const result = await getLink(shortUrl);

			if (isRight(result)) {
				const { link } = unwrapEither(result);
				return reply.status(200).send({ link });
			}

			return reply.status(400).send({
				message: "Link não encontrado",
			});
		},
	);
};

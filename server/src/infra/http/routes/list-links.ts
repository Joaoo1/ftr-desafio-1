import { listLinks } from "@/app/functions/list-links";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listLinksRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/links",
		{
			schema: {
				summary: "list links",
				tags: ["links"],
				response: {
					201: z.object({
						links: z.array(
							z.object({
								id: z.string(),
								originalUrl: z.string(),
								shortUrl: z.string(),
								accessCount: z.number(),
							}),
						),
					}),
				},
			},
		},
		async (request, reply) => {
			const result = await listLinks();

			if (isRight(result)) {
				const { links } = unwrapEither(result);
				return reply.status(200).send({ links });
			}
		},
	);
};

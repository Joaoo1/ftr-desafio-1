import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/create-link";
import { removeLinkRoute } from "./routes/delete-link";
import { exportLinksRoute } from "./routes/export-links";
import { getLinkRoute } from "./routes/get-link";
import { incrementLinkAccessCountRoute } from "./routes/increment-link-access-count";
import { listLinksRoute } from "./routes/list-links";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Validation error",
			issues: error.validation,
		});
	}

	console.error(error);

	return reply.status(500).send({ message: "Internal app error." });
});

app.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});
app.register(fastifyMultipart);
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Brev.ly",
			version: "0.0.1",
		},
	},
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(createLinkRoute);
app.register(getLinkRoute);
app.register(listLinksRoute);
app.register(removeLinkRoute);
app.register(exportLinksRoute);
app.register(incrementLinkAccessCountRoute);

export { app };

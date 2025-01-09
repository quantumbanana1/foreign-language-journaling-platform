import { FastifyInstance } from "fastify";

export default async function myFeedRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/my-feed",
    handler: app.userPlugin,
    preValidation: app.decryptBodyRequest,
    preHandler: app.authorizeOnRequest,
  });
}

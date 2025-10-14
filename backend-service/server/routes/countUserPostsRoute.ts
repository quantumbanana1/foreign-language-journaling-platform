import { FastifyInstance } from "fastify";

const paramsSchema = {
  type: "object",
  properties: {
    userId: { type: "integer" },
  },
  required: ["userId"],
  additionalProperties: false,
};

const ResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        post_count: { type: "integer" },
        likes_count: { type: "integer" },
      },
      required: ["post_count", "likes_count"],
      additionalProperties: false,
    },
    message: { type: "string" },
    success: { type: "boolean" },
  },
  required: ["data"],
  additionalProperties: false,
};

const failedResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  additionalProperties: false,
};

const responseSchema = {
  200: ResponseSchema,
  401: failedResponse,
  500: failedResponse,
};

const schema = {
  params: paramsSchema,
  response: responseSchema,
};

export default async function countUserPostsRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/user/:userId/amount/posts",
    handler: app.countUserPostsPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

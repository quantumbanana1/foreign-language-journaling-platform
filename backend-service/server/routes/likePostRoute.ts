import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      success: { type: "boolean" },
      data: { type: "object" },
    },
    additionalProperties: false,
  },
  500: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: { type: "object" },
    },
    additionalProperties: false,
  },
};

const body = {
  type: "object",
  properties: {
    postId: { type: "number" },
  },
  additionalProperties: false,
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function likePostRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/like/post/:postId",
    handler: app.likeUserPost,
    onRequest: app.authorizeOnRequest,
    schema: schema,
  });
}

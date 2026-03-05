import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      success: { type: "boolean" },
      followingStatus: { type: "boolean" },
    },
    additionalProperties: false,
  },
  500: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      followingStatus: { type: "boolean" },
    },
    additionalProperties: false,
  },
};

const body = {
  type: "object",
  properties: {
    user_id: { type: "number" },
  },
  additionalProperties: false,
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function updateCommentRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/follow/user/:user_id",
    handler: app.followUserPlugin,
    onRequest: app.authorizeOnRequest,
    preValidation: app.authorizeIfFollow,
    schema: schema,
  });
}

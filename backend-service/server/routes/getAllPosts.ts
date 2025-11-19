import { FastifyInstance } from "fastify";

const successResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: ["integer", "string"] },
          username: { type: ["string"] },
          title: { type: ["string"] },
          post_content: { type: ["string"] },
          time_created: { type: ["string"], format: "date-time" },
          image_url: { type: ["string"] },
          like_count: { type: ["integer"] },
          comments_count: { type: ["integer"] },
          status: { type: ["string"] },
        },
        additionalProperties: true,
      },
    },
    message: { type: "string" },
  },
  required: ["data"],
};

const failedResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
  additionalProperties: false,
};

const responseSchema = {
  200: successResponseSchema,
  401: failedResponse,
  500: failedResponse,
};

const schema = {
  response: responseSchema,
};

export default async function userPostsByNicknameRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/posts",
    onRequest: app.authorizeOnRequest,
    handler: app.getAllPostsPlugin,
    schema,
  });
}

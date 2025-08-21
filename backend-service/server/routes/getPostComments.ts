import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    post_id: { type: "number" },
  },
  additionalProperties: false,
};

const comment = {
  type: "object",
  properties: {
    message: { type: "string" },
    success: { type: "boolean" },

    data: {
      type: "array",
      posts: {
        type: "object",
        properties: {
          id: { type: "number" },
          post_id: { type: "number" },
          user_id: { type: "number" },
          username: { type: "string" },
          profile_photo_url: { type: "string" },
          content: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

const responseError = {
  type: "object",
  properties: {
    uploadSuccess: { type: "boolean" },
    message: { type: "string" },
    additionalProperties: false,
  },
  additionalProperties: false,
};

const schema = {
  querystring: queryStringJsonSchema,
  200: comment,
  401: responseError,
};

export default async function getCommentRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/post/comments",
    handler: app.getCommentsPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

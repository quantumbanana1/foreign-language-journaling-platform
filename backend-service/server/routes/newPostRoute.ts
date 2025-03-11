import { FastifyInstance } from "fastify";

const bodyNewPost = {
  type: "object",
  properties: {
    basicInfo: {
      type: "object",
      properties: {
        title: { type: "string" },
        language: { type: "string" },
        interests: {
          type: "array",
          items: {
            type: "object",
            properties: {
              interest_id: { type: "integer" },
              name: { type: "string" },
              type: { type: "string" },
            },
            required: ["interest_id", "name", "type"],
          },
        },
      },
      required: ["title", "language", "interests"],
    },
    post_info: {
      type: "object",
      properties: {
        data: { type: "string", format: "date-time" },
        image: { type: "string" },
      },
      required: ["data", "image"],
    },
    postContent: {
      type: "object",
      properties: {
        content: {
          type: "object",
          properties: {
            changingThisBreaksApplicationSecurity: { type: "string" },
          },
          required: ["changingThisBreaksApplicationSecurity"],
        },
      },
      required: ["content"],
    },
  },
  required: ["basicInfo", "post_info", "postContent"],
};

const responseError = {
  type: "object",
  properties: {
    logout: { type: "boolean" },
    message: { type: "string" },
  },
};

const newPostSchema = {
  body: bodyNewPost,
  200: bodyNewPost,
  401: responseError,
};

export default async function newPostPlugin(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/upload/new-post",
    schema: newPostSchema,
    handler: app.uploadNewPostPlugin,
    // preValidation: app.decryptBodyRequest,
  });
}

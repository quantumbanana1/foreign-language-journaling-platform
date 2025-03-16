import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    post_id: { type: "number" },
  },
  additionalProperties: false,
};

const responseError = {
  type: "object",
  properties: {
    logout: { type: "boolean" },
    message: { type: "string" },
  },
};

const successResponse = {
  type: "object",
  properties: {
    post_id: { type: "integer" },
    username: { type: "string" },
    image_url: { type: ["string", "null"] },
    time_created: { type: "string", format: "date-time" },
    like_count: { type: "integer" },
    post_content: { type: "string" },
    title: { type: "string" },
    interests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["interest"] },
          interest_id: { type: "integer" },
        },
        required: ["name", "type", "interest_id"],
      },
    },
    language_object: {
      type: "object",
      properties: {
        code: { type: "string" },
        name: { type: "string" },
        type: { type: "string", enum: ["language"] },
        language_id: { type: "integer" },
      },
      required: ["code", "name", "type", "language_id"],
    },
  },
  required: [
    "post_id",
    "username",
    "time_created",
    "like_count",
    "post_content",
    "title",
    "interests",
    "language_object",
  ],
};

const newPostSchema = {
  querystring: queryStringJsonSchema,
  200: successResponse,
  401: responseError,
};

export default async function newPostPlugin(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/post",
    schema: newPostSchema,
    handler: app.getPostPlugin,
    // preValidation: app.decryptBodyRequest,
  });
}

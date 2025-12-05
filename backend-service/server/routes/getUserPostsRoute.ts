import { FastifyInstance } from "fastify";

const paramsSchema = {
  type: "object",
  properties: {
    nickname: { type: "string", minLength: 1 },
    id: { type: "boolean" },
    title: { type: "boolean" },
    post_content: { type: "boolean" },
    time_created: { type: "boolean" },
    updated_at: { type: "boolean" },
    image_url: { type: "boolean" },
    like_count: { type: "boolean" },
    comments_count: { type: "boolean" },
    limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    offset: { type: "integer", minimum: 0, default: 0 },
    order: { type: "string", enum: ["asc", "desc"], default: "desc" },
  },
  required: ["nickname"],
  additionalProperties: false,
};

const querySchema = {
  type: "object",
  properties: {
    id: { type: "boolean" },
    title: { type: "boolean" },
    post_content: { type: "boolean" },
    time_created: { type: "boolean" },
    updated_at: { type: "boolean" },
    image_url: { type: "boolean" },
    like_count: { type: "boolean" },
    comments_count: { type: "boolean" },
    limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    offset: { type: "integer", minimum: 0, default: 0 },
    order: { type: "string", enum: ["asc", "desc"], default: "desc" },
  },
  additionalProperties: false,
};

const successResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          post_id: { type: ["integer", "string"] },
          title: { type: ["string", "null"] },
          post_content: { type: ["string", "null"] },
          time_created: { type: ["string", "null"], format: "date-time" },
          image_url: { type: ["string", "null"] },
          like_count: { type: ["integer", "null"] },
          comments_count: { type: ["integer", "null"] },
          status: { type: ["string"] },
        },
        additionalProperties: true,
      },
    },
    message: { type: "string" },
    success: { type: "boolean" },
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
  params: paramsSchema,
  response: responseSchema,
};

export default async function userPostsByNicknameRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/user/:nickname/posts",
    onRequest: app.authorizeOnRequest,
    handler: app.getUserPosts,
    schema,
  });
}

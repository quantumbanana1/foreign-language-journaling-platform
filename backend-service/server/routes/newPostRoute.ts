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
        data: { type: "string" },
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

const successResponse = {
  type: "object",
  properties: {
    post: {
      type: "object",
      properties: {
        post_id: { type: "integer" },
        language: { type: "object" },
        post_content: { type: "string" },
        title: { type: "string" },
        data: { type: "string", format: "date-time" },
      },
      required: ["post_id", "language", "post_content", "title", "data"],
    },
    interests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          interest_id: { type: "integer" },
          name: { type: "string" },
        },
        required: ["interest_id", "name"],
      },
    },
    user: {
      type: "object",
      properties: {
        username: { type: "string" }, // Zakładając, że `usernameResponse.rows[0]` zwraca obiekt
      },
      required: ["username"],
    },
  },
  required: ["post", "interests", "user"],
};

const newPostSchema = {
  body: bodyNewPost,
  200: successResponse,
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

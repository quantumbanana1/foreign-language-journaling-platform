import { FastifyInstance } from "fastify";

const querystringSchema = {
  type: "object",
  properties: {
    username: { type: "boolean" },
    email: { type: "boolean" },
    created_at: { type: "boolean" },
    updated_at: { type: "boolean" },
    profile_photo_url: { type: "boolean" },
    description: { type: "boolean" },
    city: { type: "boolean" },
    country: { type: "boolean" },
    name: { type: "boolean" },
  },
  additionalProperties: false,
};

const failedResponse = {
  type: "object",
  properties: { message: { type: "string" }, success: { type: "boolean" } },
  required: ["message", "success"],
  additionalProperties: false,
};

// Since the returned fields are dynamic, keep "data" as a loose object.
// If you want stricter typing, enumerate properties and keep them optional.
const successResponse = {
  type: "object",
  properties: {
    data: { type: "object", additionalProperties: true },
    message: { type: "string" },
    success: { type: "boolean" },
  },
  required: ["data", "success"],
  additionalProperties: false,
};

const responseSchema = {
  200: successResponse,
  400: failedResponse,
  401: failedResponse,
  500: failedResponse,
};

const schema = {
  querystring: querystringSchema,
  response: responseSchema,
};

export default async function userRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/user",
    handler: app.userPlugin, // decorated in the plugin above
    preHandler: app.authorizeOnRequest, // like your other routes
    schema,
  });
}

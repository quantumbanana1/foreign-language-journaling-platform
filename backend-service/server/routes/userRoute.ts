import { FastifyInstance } from "fastify";
const queryStringJsonSchema = {
  type: "object",
  properties: {
    username: { type: "boolean" },
    email: { type: "boolean" },
    created_at: { type: "boolean" },
    updated_at: { type: "boolean" },
    profile_photo_url: { type: "boolean" },
    description: { type: "boolean" },
    friends: { type: "boolean" },
    name: { type: "boolean" },
    country: { type: "boolean" },
    city: { type: "boolean" },
  },
  additionalProperties: false,
};

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      username: { type: "string" },
      email: { type: "string" },
      password: { type: "string" }, // Be cautious with sensitive data!
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
      profile_photo_url: { type: "string", format: "uri" },
      description: { type: "string" },
      friends: {
        type: "array",
        items: { type: "string" }, // Assuming friends are stored as strings (e.g., usernames or IDs)
      },
    },
    additionalProperties: false,
  },
  401: {
    type: "object",
    properties: {
      logout: { type: "boolean" },
      message: { type: "string" },
    },
  },
};

const schema = {
  querystring: queryStringJsonSchema,
  response: resposneSchema,
};

export default async function userRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/user",
    handler: app.userPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

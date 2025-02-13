import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          description: { type: "string" },
          friends: {
            type: "array",
            items: { type: "string" }, // Assuming friends are stored as strings (e.g., usernames or IDs)
          },
          city: { type: "string" },
          country: { type: "string" },
          name: { type: "string" },
        },
        additionalProperties: false,
      },
      message: { type: "string" },
    },
    additionalProperties: false,
  },
  409: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    additionalProperties: false,
  },
  500: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    additionalProperties: false,
  },
};

const body = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 5, maxLength: 15 },
    email: { type: "string", format: "email" },
    name: {
      type: "string",
      writeOnly: true,
    },
    country: {
      type: "string",
      maxLength: 100,
      writeOnly: true,
    },
    description: {
      type: "string",
      maxLength: 400,
    },
  },
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function updateUserRoute(app: FastifyInstance) {
  app.route({
    method: "PATCH",
    url: "/update/user-info",
    handler: app.updateUserPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
    // preValidation: app.decryptBodyRequest,
  });
}

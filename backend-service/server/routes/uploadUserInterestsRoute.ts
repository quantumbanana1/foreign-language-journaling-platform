import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          name: { type: "string" },
          interest_id: { type: "number" },
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
    name: { type: "string" },
    interest_id: { type: "number" },
  },
  additionalProperties: false,
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function updateUserRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/update/user-interests",
    handler: app.updateUserInterestsPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
    // preValidation: app.decryptBodyRequest,
  });
}

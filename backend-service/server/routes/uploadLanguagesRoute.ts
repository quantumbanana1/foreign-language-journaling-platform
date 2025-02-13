import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      data: {
        type: "array",
        maxLength: 15,
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            language_id: {
              type: "number",
            },
            type: {
              type: "string",
            },
          },
        },
      },
      additionalProperties: false,
    },
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
    data: {
      type: "array",
      maxLength: 15,
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          language_id: {
            type: "number",
          },
          type: {
            type: "string",
          },
        },
      },
    },
    additionalProperties: false,
  },
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function uploadLanguagesRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/upload/languages",
    handler: app.uploadLanguages,
    preHandler: app.authorizeOnRequest,
    schema: schema,
    // preValidation: app.decryptBodyRequest,
  });
}

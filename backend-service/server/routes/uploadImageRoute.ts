import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      url: { type: "string" },
      message: { type: "string" },
    },
    additionalProperties: false,
  },
  500: {
    type: "object",
    properties: {
      uploadSuccess: { type: "boolean" },
      message: { type: "string" },
      additionalProperties: false,
    },
    additionalProperties: false,
  },
};

const schema = {
  description: "File uploader",
  tags: ["File Manager"],
  summary: "Upload a profile picture to the server",
  consumes: ["multipart/form-data"],
  response: resposneSchema,
};

export default async function uploadProfileImageRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/upload/image/profile-image",
    handler: app.uploadProfileImagePlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

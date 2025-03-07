import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      url: { type: "string" },
      message: { type: "string" },
      success: { type: "boolean" },
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
  summary: "Upload a post picture to the cloud",
  consumes: ["multipart/form-data"],
  response: resposneSchema,
};

export default async function uploadPostImageRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/upload/image/post-image",
    handler: app.uploadPostImagePlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

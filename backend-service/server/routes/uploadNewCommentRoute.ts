import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
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

const body = {
  type: "object",
  properties: {
    content: {
      type: "object",
      properties: {
        changingThisBreaksApplicationSecurity: { type: "string" },
      },
      required: ["changingThisBreaksApplicationSecurity"],
    },
    postId: { type: "number" },
  },
  additionalProperties: false,
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function uploadNewCommentRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/upload/post/comment",
    handler: app.uploadPostCommentPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}

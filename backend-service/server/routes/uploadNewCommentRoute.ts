import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      success: { type: "boolean" },
      data: {
        type: "object",
        properties: {
          comment_id: { type: "integer" },
          post_id: { type: "integer" },
          user_id: { type: "integer" },
          content: { type: "string" },
          username: { type: "string" },
          profile_photo_url: { type: "string", format: "uri" },
        },
        required: [
          "comment_id",
          "post_id",
          "user_id",
          "content",
          "username",
          "profile_photo_url",
        ],
      },
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

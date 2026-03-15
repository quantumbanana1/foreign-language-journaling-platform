import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    user_id: { type: "number" },
  },
  additionalProperties: false,
};

const responseError = {
  type: "object",
  properties: {
    message: { type: "string" },
    followingStatus: { type: "boolean" },
    isSameUser: { type: "boolean" },
  },
};

const successResponse = {
  type: "object",
  properties: {
    followingStatus: { type: "boolean" },
    isSameUser: { type: "boolean" },
    message: { type: "string" },
  },
};

const checkFollowSchema = {
  querystring: queryStringJsonSchema,
  response: {
    200: successResponse,
    400: responseError,
    401: responseError,
    500: responseError,
  },
};

export default async function checkUserFollowRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/user/follow",
    schema: checkFollowSchema,
    onRequest: [app.authorizeOnRequest],
    handler: app.checkIsUserFollowing,
  });
}

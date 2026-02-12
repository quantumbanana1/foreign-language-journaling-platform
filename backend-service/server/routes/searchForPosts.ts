import { FastifyInstance } from "fastify";

const paramsSchema = {
  type: "object",
  properties: {
    followedAuthors: { type: ["boolean"] },
    needsFeedback: { type: ["boolean"] },
    searchResult: { type: ["string"] },
    myLanguages: { type: ["boolean"] },
    commentedPosts: { type: ["boolean"] },
    mine: { type: ["boolean"] },
    status: { type: ["string"] },
    language_ids: {
      anyOf: [
        { type: "array", items: { type: "integer" } },
        { type: "integer" }, // allow single value
      ],
    },

    interest_ids: {
      anyOf: [
        { type: "array", items: { type: "integer" } },
        { type: "integer" },
      ],
    },
  },

  additionalProperties: false,
};

const successResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          post_id: { type: ["integer", "string"] },
          username: { type: ["string"] },
          profile_photo_url: { type: ["string"] },
          title: { type: ["string"] },
          post_content: { type: ["string"] },
          time_created: { type: ["string"], format: "date-time" },
          image_url: { type: ["string"] },
          like_count: { type: ["integer"] },
          comment_count: { type: ["integer"] },
          status: { type: ["string"] },
          language_object: {
            type: "object",
            properties: {
              language_id: { type: "integer" },
              name: { type: "string" },
              proficiency: { type: "string" },
              type: { type: ["string", "null"] },
              code: { type: ["string", "null"] },
            },
            required: ["name", "proficiency"],
            additionalProperties: true,
          },
          rank: { type: ["number"] },
        },
        additionalProperties: false,
      },
    },
    message: { type: "string" },
  },
  required: ["data"],
};

const failedResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
  additionalProperties: false,
};

const responseSchema = {
  200: successResponseSchema,
  401: failedResponse,
  500: failedResponse,
};

const schema = {
  querystring: paramsSchema,
  response: responseSchema,
};

export default async function searchForPostsRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/search/posts",
    onRequest: app.authorizeOnRequest,
    handler: app.searchForPostsFunction,
    schema,
  });
}

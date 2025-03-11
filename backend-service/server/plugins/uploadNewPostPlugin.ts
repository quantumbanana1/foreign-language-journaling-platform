import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../helpers/handleResponse";
import { INewPostRequestPayload } from "../Types/PostTypes";

export default fp(async function uploadNewPostPlugin(app: FastifyInstance) {
  async function onUploadNewPostPlugin(
    request: FastifyRequest<{ Body: INewPostRequestPayload }>,
    reply: FastifyReply,
  ) {
    // const dbquery = `INSERT INTO user_learns (user_id, language_id, proficiency) VALUES ${values} ON CONFLICT  (user_id, language_id) DO UPDATE SET proficiency = EXCLUDED.proficiency`;
    try {
      const client = await app.pg.connect();
      try {
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(error);
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  app.decorate("uploadNewPostPlugin", onUploadNewPostPlugin);
});

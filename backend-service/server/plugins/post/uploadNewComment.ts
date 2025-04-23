import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { IUserInterest } from "../../Types/interestsTypes";
import { INewComment } from "../../Types/commentTypes";

export default fp(async function uploadPostComment(app: FastifyInstance) {
  async function onUploadPostComment(
    request: FastifyRequest<{ Body: INewComment }>,
    reply: FastifyReply,
  ) {
    const postId = request.body.postId;
    const content = request.body.content;

    try {
      const client = await app.pg.connect();
      try {
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error updating user info: ", error);

      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  app.decorate("uploadPostCommentPlugin", onUploadPostComment);
});

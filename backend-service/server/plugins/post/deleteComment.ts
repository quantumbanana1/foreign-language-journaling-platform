import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { INewPostRequestPayload } from "../../Types/PostTypes";
import { IUpdatedPost, MyRequestDeleteComment } from "../../Types/commentTypes";

export default fp(async function uploadNewPostPlugin(app: FastifyInstance) {
  async function onDeleteCommentPlugin(
    request: MyRequestDeleteComment,
    reply: FastifyReply,
  ) {
    const client = await app.pg.connect();

    try {
      const results = await client.query(
        " DELETE FROM comments as c  WHERE  c.id as comment_id = $1 and c.post_id = $2",
        [request.query.comment_id, request.query.post_id],
      );

      return handleResponse(
        reply,
        200,
        null,
        "comment deleted  correctly",
        null,
      );
    } catch (error) {
      console.error(error);
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    } finally {
      client.release();
    }
  }

  app.decorate("deleteCommentPlugin", onDeleteCommentPlugin);
});

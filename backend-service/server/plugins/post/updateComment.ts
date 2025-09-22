import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { INewPostRequestPayload } from "../../Types/PostTypes";
import { IUpdatedPost } from "../../Types/commentTypes";

export default fp(async function uploadNewPostPlugin(app: FastifyInstance) {
  async function onUpdateCommentPlugin(
    request: FastifyRequest<{ Body: IUpdatedPost }>,
    reply: FastifyReply,
  ) {
    const userId = request.session.userId;
    const postId = request.body.postId;
    const commentId = request.body.comment_id;
    const content = request.body.content;

    const client = await app.pg.connect();

    try {
      const results = await client.query(
        `UPDATE comments as c 
       SET content = $1, updated_at = NOW()
     WHERE c.id = $2 AND c.post_id = $3
     RETURNING id as comment_id, post_id, user_id, content, updated_at`,
        [content, commentId, postId],
      );

      const responseData = results.rows[0];

      return handleResponse(
        reply,
        200,
        null,
        "Post uploaded correctly",
        responseData,
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

  app.decorate("updatePostCommentPlugin", onUpdateCommentPlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply } from "fastify";
import { handleError } from "../../helpers/cryptoHelpers";
import { handleResponse } from "../../helpers/handleResponse";
import { MyRequestDeleteComment } from "../../Types/commentTypes";

export default fp(async function authorization(app: FastifyInstance, opts) {
  async function checkIfDelete(
    request: MyRequestDeleteComment,
    reply: FastifyReply,
  ) {
    const userId = request.session.userId;

    if (!userId) {
      return handleResponse(
        reply,
        403,
        null,
        "You don't have access to this action",
        null,
      );
    }

    const postId = request.query.post_id;
    const commentId = request.query.comment_id;

    const client = await app.pg.connect();

    try {
      const result = await client.query(
        "SELECT c.id as comment_id, c.user_id , c.post_id from comments as c where c.id = $1 and post_id = $2",
        [commentId, postId],
      );

      if (result.rows.length === 0) {
        return handleResponse(
          reply,
          403,
          null,
          "You don't have access to this action",
          null,
        );
      }

      if (result.rows[0].user_id !== userId) {
        return handleResponse(
          reply,
          403,
          null,
          "You don't have access to this action",
          null,
        );
      } else {
        return;
      }
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
  app.decorate("canDelete", checkIfDelete);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../helpers/cryptoHelpers";
import { handleResponse } from "../../helpers/handleResponse";
import { IUpdatedPost } from "../../Types/commentTypes";

export default fp(async function authorization(app: FastifyInstance, opts) {
  async function checkIfUserCanEdit(
    request: FastifyRequest<{
      Params: { postId: number; commentId: number };
    }>,
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

    const postId = request.params.postId;
    const commentId = request.params.commentId;

    console.log(postId, commentId, "caneDIT?");

    const client = await app.pg.connect();

    try {
      const result = await client.query(
        "SELECT c.id as comment_id, c.user_id, c.post_id FROM comments as c WHERE c.id = $1 AND post_id = $2",
        [commentId, postId],
      );

      console.log(result.rows);

      if (result.rows.length === 0) {
        return handleResponse(
          reply,
          403,
          null,
          "You don't have access to this action",
          { canEdit: false },
        );
      }

      if (result.rows[0].user_id !== userId) {
        return handleResponse(
          reply,
          403,
          null,
          "You don't have access to this action",
          { canEdit: false },
        );
      }

      return handleResponse(reply, 200, null, "You can edit comments", {
        canEdit: true,
      });
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

  app.decorate("checkIfUserCanEdit", checkIfUserCanEdit);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { INewComment } from "../../Types/commentTypes";

export default fp(async function uploadPostComment(app: FastifyInstance) {
  async function onUploadPostComment(
    request: FastifyRequest<{ Body: INewComment }>,
    reply: FastifyReply,
  ) {
    const postId = request.body.postId;
    const content = request.body.content.changingThisBreaksApplicationSecurity;
    const userId = request.session.userId;
    const client = await app.pg.connect();
    try {
      // let result = await client.query(
      //   "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) ",
      //   [postId, userId, content],
      // )

      const result = await client.query(
        `
  WITH inserted AS (
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, post_id, user_id, content
  )
  SELECT 
    i.id as comment_id,
    i.post_id,
    i.user_id,
    i.content,
    u.username,
    u.profile_photo_url
  FROM inserted i
  JOIN users u ON i.user_id = u.id
  `,
        [postId, userId, content],
      );

      return handleResponse(
        reply,
        200,
        null,
        "Comment updated successfully",
        result.rows[0],
      );
    } catch (error) {
      console.error("Error uploading new comment: ", error);

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

  app.decorate("uploadPostCommentPlugin", onUploadPostComment);
});

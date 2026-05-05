import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { INewPostRequestPayload } from "../../Types/PostTypes";
import { IUserLikesPostBody } from "../../Types/PostTypes";

export default fp(async function likeUserPostPlugin(app: FastifyInstance) {
  async function onLikeUsePostPlugin(
    request: FastifyRequest<{ Body: IUserLikesPostBody }>,
    reply: FastifyReply,
  ) {
    const client = await app.pg.connect();
    let responseData = { likedPost: true };

    try {
      const results = await client.query(
        `INSERT INTO post_likes (post_id, user_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;`,
        [request.body.postId, request.session.userId],
      );

      const alreadyLiked = results.rowCount === 0;

      return handleResponse(reply, 200, null, "Liked post", responseData);
    } catch (error) {
      let responseData = { likedPost: false };
      console.error(error);
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
        responseData,
      );
    } finally {
      client.release();
    }
  }

  app.decorate("likeUserPost", onLikeUsePostPlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import IFollowUserBody from "../../Types/followingUserTypes";

export default fp(async function followUserPlugin(app: FastifyInstance) {
  async function onFollowUserPlugin(
    request: FastifyRequest<{ Body: IFollowUserBody }>,
    reply: FastifyReply,
  ) {
    const userId = request.session.userId;
    const followedUserId = request.body.user_id;

    try {
      const client = await app.pg.connect();
      try {
        const query =
          "INSERT INTO user_follows (follower_id, following_id) VALUES ($1,$2) RETURNING follower_id, following_id, t√";
        const result = await client.query(query, [userId, followedUserId]);

        return handleResponse(
          reply,
          200,
          null,
          "New following inserted successfully",
          result.rows[0],
        );
      } finally {
        client.release();
      }
    } catch (error) {
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  app.decorate("followUserPlugin", onFollowUserPlugin);
});

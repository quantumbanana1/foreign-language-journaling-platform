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
          "INSERT INTO user_follows (follower_id, following_id) VALUES ($1,$2) RETURNING follower_id, following_id";
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
      console.log(error);

      if (error.constraint == "user_follows_pkey") {
        return reply.status(500).send({
          success: false,
          message: "User already followed",
          followingStatus: false,
        });
      } else {
        return reply.status(500).send({
          success: "false",
          message: "An unexpected error occurred. Please try again later.",
          followingStatus: false,
        });
      }
    }
  }

  app.decorate("followUserPlugin", onFollowUserPlugin);
});

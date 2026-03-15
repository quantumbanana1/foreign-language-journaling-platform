import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface ICheckFollowQuery {
  user_id: number;
}

export default fp(async function checkIsUserFollowingPlugin(
  app: FastifyInstance,
) {
  async function onCheckIsUserFollowingPlugin(
    request: FastifyRequest<{ Querystring: ICheckFollowQuery }>,
    reply: FastifyReply,
  ) {
    const userId = request.session.userId;
    const followedUserId = request.query.user_id;

    try {
      if (userId === followedUserId) {
        return reply.status(200).send({
          success: true,
          message: "Cannot follow yourself",
          followingStatus: false,
          isSameUser: true, // was incorrectly false
        });
      }

      const client = await app.pg.connect();
      try {
        const query =
          "SELECT follower_id, following_id FROM user_follows WHERE follower_id = $1 AND following_id = $2";
        const result = await client.query(query, [userId, followedUserId]);

        if (result.rows.length > 0) {
          return reply.status(200).send({
            // 400 -> 200, this is not an error
            success: true,
            message: "User already followed",
            followingStatus: true, // false -> true, user IS following
            isSameUser: false,
          });
        }

        // not following
        return reply.status(200).send({
          success: true,
          message: "User is not followed",
          followingStatus: false,
          isSameUser: false,
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.log(error);
      return reply.status(500).send({
        // 401 -> 500
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        followingStatus: false,
        isSameUser: false,
      });
    }
  }

  app.decorate("checkIsUserFollowing", onCheckIsUserFollowingPlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import IFollowUserBody from "../../Types/followingUserTypes";

export default fp(async function checkIsUserFollowingPlugin(
  app: FastifyInstance,
) {
  async function onCheckIsUserFollowingPlugin(
    request: FastifyRequest<{ Body: IFollowUserBody }>,
    reply: FastifyReply,
  ) {
    const userId = request.session.userId;
    const followedUserId = request.body.user_id;

    try {
      if (userId === followedUserId) {
        return reply.status(200).send({
          success: false,
          message: "Cannot follow yourself",
          followingStatus: false,
          isSameUser: false,
        });
      }

      const client = await app.pg.connect();
      try {
        const query =
          "SELECT follower_id, following_id FROM user_follows WHERE follower_id = $1 AND following_id = $2";
        const result = await client.query(query, [userId, followedUserId]);

        if (result.rows.length > 0) {
          return reply.status(400).send({
            success: false,
            message: "User already followed",
            followingStatus: false,
            isSameUser: false,
          });
        }
      } finally {
        client.release();
      }
    } catch (error) {
      console.log(error);
      return reply.status(401).send({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        followingStatus: false,
      });
    }
  }

  app.decorate("checkIsUserFollowing", onCheckIsUserFollowingPlugin);
});

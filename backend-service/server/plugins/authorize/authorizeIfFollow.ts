import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../helpers/cryptoHelpers";
import IFollowUserBody from "../../Types/followingUserTypes";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function onAuthIfFollow(app: FastifyInstance, opts) {
  async function authorizeIfFollow(
    request: FastifyRequest<{ Body: IFollowUserBody }>,
    reply: FastifyReply,
  ) {
    const error = new Error("You don't have  access to this page");

    const followerId = request.session.userId;
    const followingId = request.body.user_id;

    const client = await app.pg.connect();

    try {
      if (!request.session.authorized) {
        handleError(reply, error, 401, "You don't have access to this page");
        await request.session.destroy();
      }

      if (followerId === followingId) {
        return reply.status(500).send({
          message: "You can't follow yourself",
          success: false,
          followingStatus: false,
        });
      }

      console.log(request.body);

      const result = await client.query(
        `
    SELECT EXISTS (
      SELECT 1
      FROM user_follows
      WHERE follower_id = $1 AND following_id = $2
    ) AS is_following
    `,
        [followerId, followingId],
      );

      console.log(result.rows[0].is_following);

      if (result.rows[0].is_follwing) {
        return reply.status(500).send({
          message: "You already followed this user",
          success: false,
          followingStatus: false,
        });
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      return reply.status(500).send({
        success: false,
        message: "Something went wrong",
        followingStatus: false,
      });
    } finally {
      client.release();
    }
  }
  app.decorate("authorizeIfFollow", authorizeIfFollow);
});

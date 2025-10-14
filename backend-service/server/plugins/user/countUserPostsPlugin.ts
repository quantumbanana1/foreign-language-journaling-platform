import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";
import { results } from "tap";

type MyRequest = FastifyRequest<{ Params: { userId: number } }>;

export default fp(async function countUserPosts(app: FastifyInstance) {
  async function onCountUserPosts(request: MyRequest, reply: FastifyReply) {
    const client: PoolClient = await app.pg.connect();
    try {
      const countPostQueryString = ` SELECT COUNT(*) as post_count from posts where user_id = $1`;

      const countPostResult: QueryResult<any> = await client.query(
        countPostQueryString,
        [request.session.userId],
      );

      const countLikesPostResult = ``;

      const finalResult = {
        likes_count: 0,
        ...countPostResult.rows[0],
      };

      console.log("finalRewsut", finalResult);

      return handleResponse(
        reply,
        200,
        null,
        "User posts attributes  counted successfully",
        finalResult,
      );
    } catch (error) {
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      client.release();
    }
  }

  app.decorate("countUserPostsPlugin", onCountUserPosts);
});

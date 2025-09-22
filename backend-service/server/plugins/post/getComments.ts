import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

interface IGetPostQueryString {
  post_id: number;
}

type MyRequest = FastifyRequest<{
  Querystring: IGetPostQueryString;
}>;

export default fp(async function getCommentsPlugin(app: FastifyInstance) {
  async function onGetCommentsPlugin(request: MyRequest, reply: FastifyReply) {
    const postId = request.query.post_id;
    const client: PoolClient = await app.pg.connect();

    const currentUserId = request.session.userId;
    try {
      const result: QueryResult<any> = await client.query(
        `SELECT c.id as comment_id, c.post_id, c.user_id, c.content, u.id, u.username, u.profile_photo_url
      from comments c 
      join users u on c.user_id = u.id 
      where c.post_id = $1`,
        [postId],
      );

      console.log(result.rows);

      result.rows = result.rows.map((row) => ({
        ...row,
        canEdit: row.user_id === currentUserId,
      }));

      return handleResponse(
        reply,
        200,
        null,
        "Languages Fetched like a boss",
        result.rows,
      );
    } catch (error) {
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      client.release();
    }
  }

  app.decorate("getCommentsPlugin", onGetCommentsPlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

type MyRequest = FastifyRequest<{ Params: { userId: number } }>;

export default fp(async function userLanguagesByIdPlugin(app: FastifyInstance) {
  async function onUserLanguagesByIdPlugin(
    request: MyRequest,
    reply: FastifyReply,
  ) {
    const userId = request.params.userId;
    const client: PoolClient = await app.pg.connect();
    try {
      const queryString = `SELECT ul.user_id, ul.language_id, ul.proficiency, l.language_id, l.name
       FROM user_learns AS ul INNER JOIN languages AS l  ON l.language_id = ul.language_id WHERE ul.user_id = $1;
`;
      const result: QueryResult<any> = await client.query(queryString, [
        userId,
      ]);

      console.log("xddddddddd", result);
      return handleResponse(
        reply,
        200,
        null,
        "Languages Fetched like a boss",
        result.rows,
      );
    } catch (error) {
      console.error(error);
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      client.release();
    }
  }

  app.decorate("userLanguagesByIdPlugin", onUserLanguagesByIdPlugin);
});

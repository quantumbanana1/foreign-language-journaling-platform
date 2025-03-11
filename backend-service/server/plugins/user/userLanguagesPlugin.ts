import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function userLanguagesPlugin(app: FastifyInstance) {
  async function onUserLanguagesPlugin(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const queryString = `SELECT ul.user_id, ul.language_id, ul.proficiency, l.language_id, l.name
       FROM user_learns AS ul INNER JOIN languages AS l  ON l.language_id = ul.language_id WHERE ul.user_id = $1;
`;
      const result: QueryResult<any> = await client.query(queryString, [
        request.session.userId,
      ]);

      console.log(result.rows);
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

  app.decorate("userLanguagesPlugin", onUserLanguagesPlugin);
});

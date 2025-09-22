import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function languagesPlugin(app: FastifyInstance) {
  async function onLanguagesPlugin(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const result: QueryResult<any> = await client.query(
        `SELECT language_id, name from languages ORDER BY language_id ASC`,
      );

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

  app.decorate("languagesPlugin", onLanguagesPlugin);
});

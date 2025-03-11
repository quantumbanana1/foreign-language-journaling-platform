import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function interestsPlugin(app: FastifyInstance) {
  async function onInterestsPlugin(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const result: QueryResult<any> = await client.query(
        `SELECT interest_id, name from interests ORDER BY interest_id ASC`,
      );

      return handleResponse(
        reply,
        200,
        null,
        "Interests fetched successfully",
        result.rows,
      );
    } catch (error) {
      console.error(error);
      handleResponse(reply, 500, error, "Internal Server Error", null);
      throw error;
    } finally {
      client.release();
    }
  }

  app.decorate("getInterestsPlugin", onInterestsPlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function getUserInterestsPlugin(app: FastifyInstance) {
  async function onGetUserInterests(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const queryString = `SELECT  ui.interest_id, i.name
FROM user_interests AS ui INNER JOIN interests AS i  ON i.interest_id = ui.interest_id WHERE ui.user_id = $1`;

      const result: QueryResult<any> = await client.query(queryString, [
        request.session.userId,
      ]);

      return handleResponse(
        reply,
        200,
        null,
        "User interests fetched successfully",
        result.rows,
      );
    } catch (error) {
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      client.release();
    }
  }

  app.decorate("getUserInterestsPlugin", onGetUserInterests);
});

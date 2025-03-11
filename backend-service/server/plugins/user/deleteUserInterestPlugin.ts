import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

interface IDeleteLanguageRequest {
  interest_id: number;
}

type MyRequest = FastifyRequest<{
  Querystring: IDeleteLanguageRequest;
}>;

export default fp(async function deleteUserInterestPlugin(
  app: FastifyInstance,
) {
  async function onDeleteUserInterestPlugin(
    request: MyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const result: QueryResult<any> = await client.query(
        `DELETE FROM user_interests WHERE interest_id = $1 and user_id = $2`,
        [request.query.interest_id, request.session.userId],
      );

      return handleResponse(reply, 200, null, "Interest deleted successfully", {
        success: true,
      });
    } catch (error) {
      console.error(error);
      return handleResponse(reply, 500, error, "Internal Server Error", {
        success: false,
      });
    } finally {
      client.release();
    }
  }

  app.decorate("deleteUserInterestPlugin", onDeleteUserInterestPlugin);
});

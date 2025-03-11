import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

interface IDeleteLanguageRequest {
  language_id: number;
}

type MyRequest = FastifyRequest<{
  Querystring: IDeleteLanguageRequest;
}>;

export default fp(async function deleteLanguagePlugin(app: FastifyInstance) {
  async function onDeleteLanguagePlugin(
    request: MyRequest,
    reply: FastifyReply,
  ) {
    const client: PoolClient = await app.pg.connect();
    try {
      const result: QueryResult<any> = await client.query(
        `DELETE FROM user_learns WHERE language_id = $1 and user_id = $2`,
        [request.query.language_id, request.session.userId],
      );

      return handleResponse(reply, 200, null, "Languages Fetched like a boss", {
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

  app.decorate("deleteLanguagePlugin", onDeleteLanguagePlugin);
});

import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { QueryResult } from "pg";

interface IUserAttrToFetch {
  username?: boolean;
  email?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
  profile_photo_url?: boolean;
  description?: boolean;
  friends?: boolean;
  city?: boolean;
  country?: boolean;
  name?: boolean;
}

type MyRequest = FastifyRequest<{
  Querystring: IUserAttrToFetch;
}>;

export default fp(async function user(app: FastifyInstance) {
  async function onUserPlugin(request: MyRequest, reply: FastifyReply) {
    console.log(request.query);
    const selectedFields = Object.entries(request.query)
      .map(([key]) => key)
      .join(", ");
    const client = await app.pg.connect();
    let result: QueryResult = await client.query(
      `SELECT ${selectedFields} FROM users WHERE id = $1`,
      [request.session.userId],
    );

    client.release();
    console.log(result.rows[0]);
    return reply.status(200).send(result.rows[0]);
  }

  app.decorate("userPlugin", onUserPlugin);
});

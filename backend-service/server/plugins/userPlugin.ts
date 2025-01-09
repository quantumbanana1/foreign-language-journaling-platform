import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { queryObjects } from "v8";
import { QueryResult } from "pg";

interface IUserAttrToFetch {
  username?: boolean;
  email?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
  profile_photo_url?: boolean;
  description?: boolean;
  friends?: boolean;
}

type MyRequest = FastifyRequest<{
  Querystring: IUserAttrToFetch;
}>;

export default fp(async function user(app: FastifyInstance, opts) {
  async function onUserPlugin(request: MyRequest, reply: FastifyReply) {
    // const client = await app.pg.connect();
    // let result: QueryResult = await client.query(
    //   "SELECT password,id, username FROM users WHERE email = $1",
    //   [email],
    // );
    // client.release();
    // const {
    //   username,
    //   email,
    //   password,
    //   created_at,
    //   updated_at,
    //   profile_photo_url,
    //   description,
    //   friends,
    // } = request.query;
    let sqlCommand = "SELECT ";
    const selectedFields = Object.entries(request.query)
      .map(([key]) => key)
      .join(", ");
    const client = await app.pg.connect();
    let result: QueryResult = await client.query(
      `SELECT ${selectedFields} FROM users WHERE id = $1`,
      [request.session.userId],
    );

    client.release();
    return reply.status(200).send(result.rows[0]);
  }

  app.decorate("userPlugin", onUserPlugin);
});

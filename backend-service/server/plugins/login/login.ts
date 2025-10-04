import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { QueryResult } from "pg";

import bycrpt from "bcrypt";
interface logginUser {
  email: string;
  userPassword: string;
}

export default fp(async function logging(app: FastifyInstance): Promise<void> {
  async function onLoggingRoute(
    request: FastifyRequest<{ Body: logginUser }>,
    reply: FastifyReply,
  ) {
    const { email, userPassword } = request.body;
    if (!email || !userPassword) {
      return reply.status(401).send({ message: "All fields are required" });
    }

    const client = await app.pg.connect();
    let result: QueryResult = await client.query(
      "SELECT password,id, username FROM users WHERE email = $1",
      [email],
    );
    client.release();

    if (!(result.rows.length > 0)) {
      return reply.status(401).send({ message: "Username is not found" });
    }
    const { id, password } = result.rows[0];

    if (!(await bycrpt.compare(userPassword, password))) {
      return reply
        .status(401)
        .send({ message: "Password or user is incorrect" });
    }
    request.session.authorized = true;
    request.session.userId = id;
    return reply.status(200).send({ success: true });
  }

  app.decorate("loggingPlugin", onLoggingRoute);
});

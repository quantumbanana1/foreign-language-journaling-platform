import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../helpers/cryptoHelpers";
import { QueryResult } from "pg";
import S from "fluent-json-schema";
import bycrpt from "bcrypt";
import { randomBytes } from "crypto";
import { noop } from "../helpers/redisStore";
import { response } from "express";

interface logginUser {
  email: string;
  userPassword: string;
}

function generateSessionId(): string {
  return randomBytes(16).toString("hex");
}

export default fp(async function logging(app: FastifyInstance): Promise<void> {
  async function onLoggingRoute(
    request: FastifyRequest<{ Body: logginUser }>,
    reply: FastifyReply,
  ) {
    const { email, userPassword } = request.body;
    if (!email || !userPassword) {
      return reply.status(400).send({ message: "All fields are required" });
    }

    const client = await app.pg.connect();
    let result: QueryResult = await client.query(
      "SELECT password,id, username FROM users WHERE email = $1",
      [email],
    );
    client.release();

    if (!(result.rows.length > 0)) {
      return reply.status(400).send({ message: "Username is not found" });
    }
    const { id, password, username } = result.rows[0];

    if (!(await bycrpt.compare(userPassword, password))) {
      return reply
        .status(500)
        .send({ message: "Password or user is incorrect" });
    }
    request.session.userId = id;
    request.session.username = username;
    return reply.status(201).send({ success: true });
  }

  app.decorate("loggingPlugin", onLoggingRoute);
});

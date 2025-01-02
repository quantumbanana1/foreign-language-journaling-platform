import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bycrpt from "bcrypt";
import { PoolClient, QueryResult } from "pg";
import crypto from "crypto";
import NewUser from "../Classes/User";

const logOutUserSchema = {
  body: {
    type: "object",
    required: ["logOut"],
    properties: {
      loginOut: { type: "boolean" },
    },
  },
};

export default async function logOutRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/logout",
    schema: logOutUserSchema,
    handler: app.logOutPlugin,
    preValidation: app.decryptBodyRequest,
  });
}

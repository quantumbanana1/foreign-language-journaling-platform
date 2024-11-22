import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bycrpt from "bcrypt";
import { PoolClient, QueryResult } from "pg";
import crypto from "crypto";
import NewUser from "../Classes/User";
interface RegisterBody {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default async function registerRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/registration",
    handler: app.registrationPlugin,
    preValidation: app.decryptBodyRequest,
  });
}

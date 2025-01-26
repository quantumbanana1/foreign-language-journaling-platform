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

const registerUserSchema = {
  body: {
    type: "object",
    required: ["username", "password", "confirmPassword", "email"],
    properties: {
      username: { type: "string", minLength: 5, maxLength: 15 },
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 8,
        pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
        writeOnly: true,
      },
      confirmPassword: {
        type: "string",
        minLength: 8,
        pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
        writeOnly: true,
      },
    },
  },
};

export default async function registerRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/registration",
    schema: registerUserSchema,
    handler: app.registrationPlugin,
    preValidation: app.decryptBodyRequest,
  });
}

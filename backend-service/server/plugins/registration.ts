import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { PoolClient, QueryResult } from "pg";
import { randomBytes } from "crypto";
import bycrpt from "bcrypt";
import NewUser from "../Classes/User";
import fp from "fastify-plugin";
interface RegisterBody {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

async function generateKey(client: PoolClient): Promise<string> {
  const id = randomBytes(16).toString("base64");
  const result: QueryResult = await client.query(
    "SELECT * FROM users WHERE unique_key = $1",
    [id],
  );
  if (result.rows.length > 0) {
    return generateKey(client);
  } else {
    return id;
  }
}

const registerUserSchema = {
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
};

export default fp(async function registration(app: FastifyInstance, opts) {
  async function onRegisterRoute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const bodyValidationFunction =
        request.compileValidationSchema(registerUserSchema);
      if (bodyValidationFunction(request.body) !== true) {
        return reply.status(400).send({
          message: "Invalid request body",
          errors: bodyValidationFunction.errors,
        });
      }
      const { username, email, password, confirmPassword } =
        request.body as RegisterBody;

      if (!username || !email || !password) {
        return reply.status(400).send({ message: "All fields are required." });
      }

      if (password !== confirmPassword) {
        return reply.status(400).send({ message: "Passwords do not match." });
      }

      const client = await app.pg.connect();
      let result: QueryResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      if (result.rows.length > 0) {
        return reply.status(400).send({ message: "Email already exists." });
      }

      result = await client.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      if (result.rows.length > 0) {
        return reply.status(400).send({ message: "Username already exists." });
      }

      const unique_key: string = await generateKey(client);

      const hashedPassword = await bycrpt.hash(password, 10);
      const newUser: NewUser = new NewUser(
        username,
        email,
        hashedPassword,
        unique_key,
      );
      const userObject = newUser.returnUserObject();
      result = await client.query(
        "INSERT INTO users (username, email, password, unique_key) VALUES ($1, $2, $3, $4) RETURNING id",
        [
          userObject.username,
          userObject.email,
          userObject.password,
          userObject.unique_key,
        ],
      );

      client.release();

      reply.status(201).send({
        message: "User registered successfully",
        user_id: result.rows[0].id,
      });
    } catch (error) {
      reply.status(500).send({
        error: error.message,
        message: "registerRoute failed",
      });
    }
  }

  app.decorate("registrationPlugin", onRegisterRoute);
});

import postgres from "@fastify/postgres";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import Cors from "@fastify/cors";
import AutoLoad from "@fastify/autoload";
import { join } from "desm";
import S from "fluent-json-schema";
import fastifyEnv from "@fastify/env";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      PORT: string;
      SECRET_KEY: string;
      CONNECTION_STRING: string;
      PRIVATE_KEY: string;
    };
    decryptBodyRequest: MyAsyncHandler;
    registrationPlugin: MyAsyncHandler;
  }
}

interface MyAsyncHandler {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

const app = fastify({ logger: false });

await app.register(fastifyEnv, {
  dotenv: {
    path: `../.env`,
    debug: false,
  },
  schema: S.object()
    .prop("NODE_ENV", S.string().required())
    .prop("PORT", S.string().required())
    .prop("SECRET_KEY", S.string().required())
    .prop("CONNECTION_STRING", S.string().required())
    .prop("PRIVATE_KEY", S.string().required())
    .valueOf(),
});

app.register(postgres, {
  connectionString: app.config.CONNECTION_STRING,
});

app.register(Cors, {
  origin: true,
});

await app.register(AutoLoad, {
  dir: join(import.meta.url, "plugins"),
  dirNameRoutePrefix: false,
});

await app.register(AutoLoad, {
  dir: join(import.meta.url, "routes"),
  dirNameRoutePrefix: false,
});

app.get("/test", async (request, reply) => {
  try {
    const client = await app.pg.connect();
    const result = await client.query("SELECT 1");
    client.release();
    reply.send({
      output: result.rows,
      message: "Database connection successful",
    });
  } catch (error) {
    reply.status(500).send({
      error: error.message,
      message: "Database connection failed",
    });
  }
});

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

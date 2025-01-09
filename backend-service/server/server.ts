import postgres from "@fastify/postgres";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import Cors from "@fastify/cors";
import AutoLoad from "@fastify/autoload";
import { join } from "desm";
import S from "fluent-json-schema";
import fastifyEnv from "@fastify/env";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import Redis from "ioredis";
import { RedisStore } from "./helpers/redisStore";
import { RedisStoreOptions } from "./helpers/redisStore";

let redisClient = new Redis({ host: "localhost", port: 6379 });

// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });
//
// redisClient.on("error", (err) => {
//   console.error("Redis connection error", err);
// });
//
// redisClient.connect().catch(console.error);

const options: RedisStoreOptions = {
  client: redisClient,
  ttl: 3600000,
  serializer: JSON,
  disableTTL: false,
};

// Initialize store.
let redisStorage = new RedisStore(options);

interface ISessionUser {
  username: string;
  userId: number;
  sessionId: string;
  role: string;
}

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
    loggingPlugin: MyAsyncHandler;
    authorizeOnRequest: MyAsyncHandler;
    logOutPlugin: MyAsyncHandler;
    authorizePlugin: MyAsyncHandler;
    userPlugin: MyAsyncHandler;
    isLogged: MyAsyncHandler;
  }
  interface Session {
    username: string;
    userId: number;
    role: string;
    authorized: boolean;
  }
}

interface MyAsyncHandler {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

const app = fastify({ logger: true });

await app.register(fastifyEnv, {
  dotenv: {
    path: `../.env`,
    debug: true,
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
  origin: ["http://localhost:4200", "http://localhost:8080"],
  credentials: true,
});

app.register(fastifyCookie);

app.register(fastifySession, {
  cookieName: "sessionId",
  secret: "a secret with minimum length of 32 characters",
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000,
    httpOnly: true,
    sameSite: true,
  },
  store: redisStorage,
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

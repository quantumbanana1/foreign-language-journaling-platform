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
import { fastifyCloudinaryWithAsync } from "./helpers/fastify-cloudinary";
import Multipart from "@fastify/multipart";

let redisClient = new Redis({ host: "localhost", port: 6379 });

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error", err);
});

redisClient.connect().catch(console.error);

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
      COOKIE_SECRET: string;
      CLOUDINARY_CLOUDNAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_URL: string;
    };
    decryptBodyRequest: MyAsyncHandler;
    registrationPlugin: MyAsyncHandler;
    loggingPlugin: MyAsyncHandler;
    authorizeOnRequest: MyAsyncHandler;
    logOutPlugin: MyAsyncHandler;
    authorizePlugin: MyAsyncHandler;
    userPlugin: MyAsyncHandler;
    isLogged: MyAsyncHandler;
    uploadProfileImagePlugin: MyAsyncHandler;
    updateUserPlugin: MyAsyncHandler;
    languagesPlugin: MyAsyncHandler;
    uploadLanguages: MyAsyncHandler;
    userLanguagesPlugin: MyAsyncHandler;
    deleteLanguagePlugin: MyAsyncHandler;
    getInterestsPlugin: MyAsyncHandler;
    updateUserInterestsPlugin: MyAsyncHandler;
    getUserInterestsPlugin: MyAsyncHandler;
    deleteUserInterestPlugin: MyAsyncHandler;
    uploadPostImagePlugin: MyAsyncHandler;
    uploadNewPostPlugin: MyAsyncHandler;
    getPostPlugin: MyAsyncHandler;
    uploadPostCommentPlugin: MyAsyncHandler;
    getCommentsPlugin: MyAsyncHandler;
    updatePostCommentPlugin: MyAsyncHandler;
    authorizeIfEdit: MyAsyncHandler;
    deleteCommentPlugin: MyAsyncHandler;
    canDelete: MyAsyncHandler;
    userLanguagesByIdPlugin: MyAsyncHandler;
    countUserPostsPlugin: MyAsyncHandler;
    getUserPosts: MyAsyncHandler;
    getAllPostsPlugin: MyAsyncHandler;
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
    .prop("CLOUDINARY_CLOUDNAME", S.string().required())
    .prop("CLOUDINARY_API_KEY", S.string().required())
    .prop("CLOUDINARY_API_SECRET", S.string().required())
    .prop("CLOUDINARY_URL", S.string().required())
    .valueOf(),
});

await app.register(postgres, {
  connectionString: app.config.CONNECTION_STRING,
});

await app.register(Cors, {
  origin: ["http://localhost:4200", "http://localhost:8080"],
  credentials: true,
});

await app.register(fastifyCookie);

await app.register(fastifySession, {
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

await app.register(fastifyCloudinaryWithAsync, {
  cloud_name: app.config.CLOUDINARY_CLOUDNAME,
  api_key: app.config.CLOUDINARY_API_KEY,
  api_secret: app.config.CLOUDINARY_API_SECRET,
});

await app.register(Multipart, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100, // Max field value size in bytes
    fields: 10, // Max number of non-file fields
    fileSize: 1000000, // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000, // Max number of header key=>value pairs
    parts: 1000, // For multipart forms, the max number of parts (fields + files)
  },
});

await app.register(AutoLoad, {
  dir: join(import.meta.url, "plugins"),
  dirNameRoutePrefix: false,
});

await app.register(AutoLoad, {
  dir: join(import.meta.url, "routes"),
  dirNameRoutePrefix: false,
});

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

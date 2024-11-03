import postgres from "@fastify/postgres";
import registerRoute from "./routes/profileRoute";
import fastify from "fastify";
import Cors from "@fastify/cors";
import AutoLoad from "@fastify/autoload";
import { join } from "desm";

const app = fastify({ logger: true });

app.register(postgres, {
  connectionString:
    "postgresql://postgres:postgres@localhost:5432/language-app",
});

// app.register(registerRoute);

app.register(Cors, {
  origin: true,
});

app.register(AutoLoad, {
  dir: join(import.meta.url, "routes"),
  dirNameRoutePrefix: false,
  options: Object.assign({}),
});

app.get("/test", async (request, reply) => {
  try {
    const client = await app.pg.connect();
    const result = await client.query("SELECT 1");
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

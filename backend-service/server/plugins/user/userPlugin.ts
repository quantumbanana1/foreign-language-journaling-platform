import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

interface IUserAttrToFetch {
  username?: boolean;
  email?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
  profile_photo_url?: boolean;
  description?: boolean;
  friends?: boolean;
  city?: boolean;
  country?: boolean;
  name?: boolean;
}

type MyRequest = FastifyRequest<{ Querystring: IUserAttrToFetch }>;

export default fp(async function user(app: FastifyInstance) {
  async function onUserPlugin(request: MyRequest, reply: FastifyReply) {
    const userId = request.session?.userId; // you already use authorizeOnRequest
    if (!userId) {
      return handleResponse(
        reply,
        401,
        new Error("Unauthorized"),
        "Unauthorized",
        null,
      );
    }

    // Whitelist of columns allowed to be queried
    const allowedColumns: Record<keyof IUserAttrToFetch, string> = {
      username: "username",
      email: "email",
      created_at: "created_at",
      updated_at: "updated_at",
      profile_photo_url: "profile_photo_url",
      description: "description",
      friends: "friends",
      city: "city",
      country: "country",
      name: "name",
    };

    // Build the list of columns from truthy query flags, intersecting whitelist
    const selected = Object.entries(request.query ?? {})
      .filter(([, v]) => v) // keep only truthy flags
      .map(([k]) => allowedColumns[k as keyof IUserAttrToFetch])
      .filter(Boolean);

    if (selected.length === 0) {
      // You can choose a default set if you prefer
      return handleResponse(
        reply,
        400,
        new Error("No fields selected"),
        "Please select at least one field to fetch",
        null,
      );
    }

    const sql = `SELECT ${selected.join(
      ", ",
    )} FROM users WHERE id = $1 LIMIT 1`;

    let client: PoolClient | null = null;
    try {
      client = await app.pg.connect();
      const result: QueryResult = await client.query(sql, [userId]);

      // If user not found, return empty object (or 404 if you prefer)
      const row = result.rows[0] ?? {};

      console.log("THIS IS ROOOW!!!", row);

      return handleResponse(
        reply,
        200,
        null,
        "User fields fetched successfully",
        row,
      );
    } catch (error) {
      console.error(error);
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      if (client) {
        console.log("cancelowanie");
        client.release();
      }
    }
  }

  app.decorate("userPlugin", onUserPlugin);
});

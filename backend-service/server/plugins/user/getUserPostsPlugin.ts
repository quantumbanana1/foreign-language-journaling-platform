import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";
import * as querystring from "node:querystring";

type Order = "asc" | "desc";

interface Params {
  nickname: string;
}

interface QueryOptions {
  id?: boolean;
  title?: boolean;
  post_content?: boolean;
  time_created?: boolean;
  image_url?: boolean;
  like_count?: boolean;
  comment_count?: boolean;
  limit?: number;
  offset?: number;
  order?: Order;
  status: string; // required per your interface
}
type PostRow = Record<string, any>;

export default fp(async function getUserPosts(app: FastifyInstance) {
  async function onGetUserPosts(
    request: FastifyRequest<{ Params: Params; Querystring: QueryOptions }>,
    reply: FastifyReply,
  ) {
    const { nickname } = request.params;

    const {
      id,
      title,
      post_content,
      time_created,
      image_url,
      like_count,
      comment_count,
      status,
      limit,
      order,
      offset,
    } = request.query;

    // Build SELECT list based on flags (default to a sensible minimal set if none given)
    const baseCols: string[] = [];
    if (id ?? true) baseCols.push("p.post_id"); // default include id
    if (title) baseCols.push("p.title");
    if (post_content) baseCols.push("p.post_content");
    if (time_created ?? true) baseCols.push("p.time_created"); // default include timestamp
    if (image_url) baseCols.push("p.image_url");
    if (like_count) baseCols.push("p.like_count");
    if (comment_count) baseCols.push("p.comment_count");

    // If literally nothing selected, choose a safe default set
    if (baseCols.length === 0) {
      baseCols.push("p.id", "p.title", "p.time_created");
    }

    // Only allow ordering by known column(s), default to time_created
    const orderBy = "p.time_created";
    const orderDir = order === "asc" ? "ASC" : "DESC";

    const selectList = [...baseCols].join(", ");

    const sql = `
        SELECT ${selectList}
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE u.username =  $1 AND p.status IN ($2)
        ORDER BY ${orderBy} ${orderDir}
        LIMIT $3 OFFSET $4
      `;

    const client = await app.pg.connect();
    try {
      const result = await client.query<PostRow>(sql, [
        nickname,
        status,
        limit,
        offset,
      ]);

      return handleResponse(
        reply,
        200,
        null,
        "user posts fetched successfully",
        result.rows,
      );
    } catch (error) {
      app.log.error(error);
      console.error(error);
      return handleResponse(reply, 500, error, "Internal Server Error", null);
    } finally {
      client?.release();
    }
  }

  app.decorate("getUserPosts", onGetUserPosts);
});

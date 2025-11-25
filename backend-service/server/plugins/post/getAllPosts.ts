import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PoolClient, QueryResult } from "pg";
import { handleResponse } from "../../helpers/handleResponse";

export default fp(async function allPosts(app: FastifyInstance) {
  async function getAllPosts(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.session.userId;
    if (!userId) {
      return handleResponse(
        reply,
        401,
        new Error("Unauthorized"),
        "Unauthorized",
        null,
      );
    }

    const sql = `SELECT 
  p.post_id,
  p.title,
  p.image_url,
  p.status,
  p.time_created,
  p.post_content,
  p.comment_count,
  p.like_count,
  u.username,
  u.profile_photo_url,
  json_build_object('language_id', l.language_id, 'name', l.name, 'proficiency', ul.proficiency) as language_object
FROM posts p
JOIN users u ON u.id = p.user_id
JOIN languages l on l.language_id = p.language_id
LEFT JOIN  user_learns ul on ul.language_id = p.language_id and ul.user_id = p.user_id
WHERE p.status = $1`;

    console.log("sql query", sql);

    let client: PoolClient | null = null;
    try {
      client = await app.pg.connect();
      const result: QueryResult = await client.query(sql, ["published"]);

      console.log(result.rows);
      return handleResponse(
        reply,
        200,
        null,
        "posts fetched successfully",
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

  // Decorate if you like calling it from elsewhere (mirrors your userPlugin pattern)
  app.decorate("getAllPostsPlugin", getAllPosts);
});

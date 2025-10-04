import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";

interface IGetPostQueryString {
  post_id: number;
}

type MyRequest = FastifyRequest<{
  Querystring: IGetPostQueryString;
}>;

export default fp(async function getPostPlugin(app: FastifyInstance) {
  async function onGetPostPlugin(request: MyRequest, reply: FastifyReply) {
    const postId = request.query.post_id;
    const client = await app.pg.connect();

    try {
      const postResponse = await client.query(
        `SELECT 
    p.post_id, 
    u.username,
    u.id as user_id,
    u.profile_photo_url,
    p.image_url, 
    p.time_created, 
    p.like_count,  
    p.post_content,  
    p.title,
ARRAY_AGG(jsonb_build_object('name', i.name, 'interest_id', i.interest_id, 'type', 'interest')) AS interests,
jsonb_build_object('name', l.name, 'language_id',p.language_id, 'code', l.code, 'type', 'language')  AS language_object
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN languages l ON p.language_id = l.language_id
LEFT JOIN post_interests pi ON p.post_id = pi.post_id 
LEFT JOIN interests i ON pi.interest_id = i.interest_id
WHERE p.post_id = $1
GROUP BY p.post_id, u.username, u.id, u.profile_photo_url, p.image_url, p.time_created, 
         p.like_count, p.post_content, p.title, l.name, l.code;`,
        [postId],
      );

      const responseData = postResponse.rows[0];

      console.log(responseData);
      return handleResponse(
        reply,
        200,
        null,
        "Post uploaded correctly",
        responseData,
      );
    } catch (error) {
      console.error(error);
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    } finally {
      client.release();
    }
  }

  app.decorate("getPostPlugin", onGetPostPlugin);
});

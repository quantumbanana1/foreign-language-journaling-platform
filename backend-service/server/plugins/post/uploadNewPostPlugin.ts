import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { INewPostRequestPayload } from "../../Types/PostTypes";

export default fp(async function uploadNewPostPlugin(app: FastifyInstance) {
  async function onUploadNewPostPlugin(
    request: FastifyRequest<{ Body: INewPostRequestPayload }>,
    reply: FastifyReply,
  ) {
    const { basicInfo, post_info, postContent } = request.body;
    const userId = request.session.userId;

    const client = await app.pg.connect();

    try {
      await client.query("BEGIN");

      const postRes = await client.query(
        `INSERT INTO posts (user_id, language_id, post_content, title) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          userId,
          basicInfo.language,
          postContent.content.changingThisBreaksApplicationSecurity,
          basicInfo.title,
        ],
      );
      const postId = postRes.rows[0].post_id;
      const interestValues = basicInfo.interests.map((interest) => [
        postId,
        interest.interest_id,
      ]);
      console.log(interestValues);
      const queryText = `INSERT INTO post_interests (post_id, interest_id) VALUES ${interestValues}`;
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

  app.decorate("uploadNewPostPlugin", onUploadNewPostPlugin);
});

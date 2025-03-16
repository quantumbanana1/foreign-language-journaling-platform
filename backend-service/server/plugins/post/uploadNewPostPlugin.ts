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
        `INSERT INTO posts (user_id, language_id, post_content, title, image_url) 
         VALUES ($1, $2, $3, $4, $5) RETURNING post_id, time_created`,
        [
          userId,
          basicInfo.language,
          postContent.content.changingThisBreaksApplicationSecurity,
          basicInfo.title,
          post_info.image,
        ],
      );

      const postId = postRes.rows[0].post_id;
      const interestValues = basicInfo.interests.map((interest) => [
        postId,
        interest.interest_id,
      ]);
      const $interestValues = interestValues
        .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
        .join(", ");
      const flattedInterestValues = interestValues.flat();
      const queryText = `INSERT INTO post_interests (post_id, interest_id) VALUES ${$interestValues}`;

      await client.query(queryText, flattedInterestValues);
      await client.query("COMMIT");

      const languageResponse = await client.query(
        `select l.language_id, l.name, l.code, u.language_id, u.proficiency from languages as l INNER JOIN user_learns as u on l.language_id = u.language_id where u.language_id = $1;
`,
        [basicInfo.language],
      );
      const usernameResponse = await client.query(
        `SELECT username FROM users WHERE id = $1`,
        [userId],
      );

      const responseData = {
        post: {
          post_id: postId,
          language: languageResponse.rows[0],
          post_content:
            postContent.content.changingThisBreaksApplicationSecurity,
          title: basicInfo.title,
          data: postRes.rows[0].time_created,
        },
        interests: basicInfo.interests,
        user: {
          username: usernameResponse.rows[0].username,
        },
      };

      return handleResponse(
        reply,
        200,
        null,
        "Post uploaded correctly",
        responseData,
      );
    } catch (error) {
      await client.query("ROLLBACK");
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

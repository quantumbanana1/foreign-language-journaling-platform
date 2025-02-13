import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../helpers/handleResponse";
import { IUploadLanguageRequest } from "../Types/languageTypes";

export default fp(async function updateLanguagesPlugin(app: FastifyInstance) {
  async function onUpdateLanguagesPlugin(
    request: FastifyRequest<{ Body: IUploadLanguageRequest }>,
    reply: FastifyReply,
  ) {
    const languages = request.body.data;
    const userId = request.session.userId;

    const values = languages
      .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
      .join(",");

    const queryParams = languages.flatMap(({ language_id, proficiency }) => [
      userId,
      language_id,
      proficiency.toLowerCase(),
    ]);

    console.log(values);
    console.log(queryParams);

    const dbquery = `INSERT INTO user_learns (user_id, language_id, proficiency) VALUES ${values} ON CONFLICT  (user_id, language_id) DO UPDATE SET proficiency = EXCLUDED.proficiency`;
    try {
      const client = await app.pg.connect();
      try {
        const result = await client.query(dbquery, queryParams);
        return handleResponse(
          reply,
          200,
          null,
          "Languages updated successfuly",
          result.rows[0],
        );
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(error);
      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  app.decorate("uploadLanguages", onUpdateLanguagesPlugin);
});

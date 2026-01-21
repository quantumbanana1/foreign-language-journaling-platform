import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { PostgresSchemaBuilder } from "remult/postgres";
import { ILanguage } from "../../Types/languageTypes";
import { IUserInterest } from "../../Types/interestsTypes";

interface IGetPostQueryString {
  followedAuthors: boolean;
  needsFeedback: boolean;
  searchResult: string;
  commentedPosts: boolean;
  myLanguages: boolean;
  language_ids?: number[] | number;
  interest_ids?: number[] | number;
  status: string;
}

type MyRequest = FastifyRequest<{
  Querystring: IGetPostQueryString;
}>;

export default fp(async function searchPostPlugin(app: FastifyInstance) {
  async function onSearchPostPlugin(request: MyRequest, reply: FastifyReply) {
    const client = await app.pg.connect();

    const langIdsRaw = request.query.language_ids;
    const language_ids = Array.isArray(langIdsRaw)
      ? langIdsRaw
      : langIdsRaw != null
      ? [langIdsRaw]
      : [];

    const intIdsRaw = request.query.interest_ids;
    const interest_ids = Array.isArray(intIdsRaw)
      ? intIdsRaw
      : intIdsRaw != null
      ? [intIdsRaw]
      : [];

    const condition = [];
    const values = [];
    let indexForValue = 1;

    try {
      Object.entries(request.query).forEach(([key, value]) => {
        console.log("key: ", key, "value: ", value);
        let con = "";
        if (key === "needsFeedback" && value === true) {
          con = `(p.comment_count  = 0)`;
          condition.push(con);
        }

        if (key === "commentedPosts" && value === true) {
          con = `p.comment_count > 0`;
          condition.push(con);
        }

        if (key === "searchResult" && value !== "") {
          con = `p.search_vector @@ plainto_tsquery('simple', $${indexForValue})`;
          condition.push(con);
          values.push(value);
          indexForValue++;
        }

        if (key === "myLanguages" && value === true) {
          con = `p.language_id in ( SELECT language_id
        FROM user_learns ul
        WHERE ul.user_id = $${indexForValue} )`;
          condition.push(con);
          values.push(request.session.userId);
          indexForValue++;
        }

        if (key === "language_ids" && language_ids.length > 0) {
          const placeholders: number[] = [];

          for (let i = 0; i < language_ids.length; i++) {
            placeholders.push(indexForValue);
            indexForValue++;

            values.push(Number(language_ids[i]));
          }

          con = `p.language_id IN (${placeholders
            .map((i) => `$${i}`)
            .join(", ")})`;
          condition.push(con);
        }

        if (key === "status") {
          con = `p.status = $${indexForValue}`;
          condition.push(con);
          values.push(value);
        }
      });

      const whereClause = condition.join(" AND ");
      console.log("WHERE CLAUSE", whereClause, values);

      const sqlQuery =
        "SELECT p.post_id, p.title, p.image_url, p.status, p.time_created, p.post_content, p.comment_count, p.like_count, p.language_id, u.username, u.profile_photo_url, json_build_object('language_id', l.language_id, 'name', l.name, 'proficiency', ul.proficiency) AS language_object  FROM posts p JOIN users u ON u.id = p.user_id JOIN languages l ON l.language_id = p.language_id LEFT JOIN user_learns ul ON ul.language_id = p.language_id AND ul.user_id = p.user_id WHERE";
      const finalSqlQuery = sqlQuery + whereClause;
      const responseData = await client.query(finalSqlQuery, [...values]);
      const data = responseData.rows;

      return handleResponse(reply, 200, null, "Post uploaded correctly", data);
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

  app.decorate("searchForPostsFunction", onSearchPostPlugin);
});

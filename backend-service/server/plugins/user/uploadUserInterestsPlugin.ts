import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleResponse } from "../../helpers/handleResponse";
import { IUserInterest } from "../../Types/interestsTypes";

export default fp(async function updateUserInterests(app: FastifyInstance) {
  async function onUpdateUserInterests(
    request: FastifyRequest<{ Body: IUserInterest }>,
    reply: FastifyReply,
  ) {
    console.log(request);
    const interest_id = request.body.interest_id;
    const userId = request.session.userId;

    try {
      const client = await app.pg.connect();
      try {
        const query = `INSERT INTO user_interests (user_id, interest_id) VALUES ($1,$2)`;
        const result = await client.query(query, [userId, interest_id]);

        return handleResponse(
          reply,
          200,
          null,
          "Interests updated successfully",
          result.rows[0],
        );
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error updating user info: ", error);

      if (error.constraint === "user_interests_pkey") {
        return handleResponse(
          reply,
          409,
          error,
          "Interest is already added to user.",
        );
      }

      return handleResponse(
        reply,
        500,
        error,
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  app.decorate("updateUserInterestsPlugin", onUpdateUserInterests);
});

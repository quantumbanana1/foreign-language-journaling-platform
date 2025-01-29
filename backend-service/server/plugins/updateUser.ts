import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { IUserAttributes } from "../Types/UserTypes";
import { handleResponse } from "../helpers/handleResponse";

export default fp(async function updateUser(app: FastifyInstance) {
  async function onUpdateUser(
    request: FastifyRequest<{ Body: IUserAttributes }>,
    reply: FastifyReply,
  ) {
    const { body } = request;
    const userId = request.session.userId;

    // Build query parts dynamically
    const keys = Object.keys(body);
    const values = Object.values(body);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const returningClause = keys.join(", ");

    try {
      // Connect to the database
      const client = await app.pg.connect();
      try {
        const query = `UPDATE users SET ${setClause} WHERE id = $${
          keys.length + 1
        } RETURNING ${returningClause}`;
        const result = await client.query(query, [...values, userId]);

        return handleResponse(
          reply,
          200,
          null,
          "Form updated successfully",
          result.rows[0],
        );
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error updating user info: ", error);

      if (error.constraint === "users_email_key") {
        return handleResponse(
          reply,
          409,
          error,
          "Email is already in use. Please update the form again.",
        );
      }

      if (error.constraint === "users_username_key") {
        return handleResponse(
          reply,
          409,
          error,
          "Username is already in use. Please update the form again.",
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

  app.decorate("updateUserPlugin", onUpdateUser);
});

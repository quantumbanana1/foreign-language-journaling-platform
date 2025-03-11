import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../helpers/cryptoHelpers";

export default fp(async function isLoggedIn(app: FastifyInstance, opts) {
  async function isLogged(request: FastifyRequest, reply: FastifyReply) {
    const error = new Error("You don't have  access to this page");
    if (!request.session.authorized || request.session.cookie.sessionId) {
      handleError(reply, error, 401, "You don't have access to this page");
    }

    const expiresAt = new Date(request.session.cookie.expires); // Parse the expiration timestamp
    const now = new Date();

    if (now > expiresAt) {
      await request.session.destroy();
      return handleError(
        reply,
        error,
        401,
        "You don't have access to this page",
      );
    } else {
      return reply.status(200).send({
        success: true,
        message: "You are logged in",
      });
    }
  }
  app.decorate("isLogged", isLogged);
});

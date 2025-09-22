import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface loginOutBody {
  logout: boolean;
}

export default fp(async function loggingOut(app: FastifyInstance, opts) {
  async function onLoggingOutRoute(
    request: FastifyRequest<{ Body: loginOutBody }>,
    reply: FastifyReply,
  ) {
    if (request.session.userId && request.body.logout) {
      try {
        await request.session.destroy();
        reply.clearCookie("sessionId");
      } catch (err) {
        return reply
          .status(401)
          .send({ logout: false, message: "logout failed" });
      }
      return reply
        .status(200)
        .send({ logout: true, message: "logout success" });
    } else {
      const error = new Error("session not found");
      return reply.status(401).send({ message: "session not found" });
    }
  }

  app.decorate("logOutPlugin", onLoggingOutRoute);
});

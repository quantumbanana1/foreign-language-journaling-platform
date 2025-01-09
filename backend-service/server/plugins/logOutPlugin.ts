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
        console.error(err);
        return reply.status(401).send({ logout: false });
      }
      return reply.status(200).send({ logout: true });
    } else {
      const error = new Error("session not found");
      console.error(error);
      return reply.status(401).send({ mess: "session not found" });
    }
  }

  app.decorate("logOutPlugin", onLoggingOutRoute);
});

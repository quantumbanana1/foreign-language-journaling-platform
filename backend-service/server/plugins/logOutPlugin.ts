import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { QueryResult } from "pg";
import bycrpt from "bcrypt";
import NewUser from "../Classes/User";

function callback(err?: any) {
  if (err) {
    throw new err();
  }
}

interface loginOutBody {
  logOut: boolean;
}

export default fp(async function loggingOut(app: FastifyInstance, opts) {
  async function onLoggingOutRoute(
    request: FastifyRequest<{ Body: loginOutBody }>,
    reply: FastifyReply,
  ) {
    if (!request.session && !request.session.userId) {
      return reply.status(400).send({
        mess: "You don't have access to this action",
      });
    }

    if (request.body.logOut && request.cookies.sessionId) {
      try {
        await request.session.destroy();
        return reply.status(200).send({ logOut: true });
      } catch (err) {
        console.error(err);
        return reply.status(400).send({ logOut: false });
      }
    } else {
      console.log("logginOutStatus is set to false");
    }
  }

  app.decorate("logOutPlugin", onLoggingOutRoute);
});

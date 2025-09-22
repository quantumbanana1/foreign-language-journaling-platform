import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../helpers/cryptoHelpers";

export default fp(async function authorization(app: FastifyInstance, opts) {
  async function authorize(request: FastifyRequest, reply: FastifyReply) {
    const error = new Error("You don't have  access to this page");

    if (!request.session.authorized) {
      handleError(reply, error, 401, "You don't have access to this page");
      await request.session.destroy();
    }
  }
  app.decorate("authorizeOnRequest", authorize);
});

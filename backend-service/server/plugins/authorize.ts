import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../helpers/cryptoHelpers";

export default fp(async function authorization(app: FastifyInstance, opts) {
  async function authorize(request: FastifyRequest, reply: FastifyReply) {
    if (!request.session || !request.session.userId) {
      const error = new Error("You don't have  access to this page");
      handleError(reply, error, 401, "You don't have access to this page");
    }
  }
  app.decorate("authorizeOnRequest", authorize);
});

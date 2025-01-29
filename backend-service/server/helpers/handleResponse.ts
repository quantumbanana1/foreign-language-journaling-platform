import { FastifyReply } from "fastify";

export function handleResponse(
  reply: FastifyReply,
  status: number,
  error?: unknown,
  customMessage?: string,
  responseObject?: object,
) {
  if (!responseObject && error) {
    console.log("error while updating");
    return reply.status(status).send({
      message:
        customMessage ||
        (error instanceof Error ? error.message : "Unknown error"),
    });
  } else {
    return reply.status(status).send({
      response: responseObject,
      message: customMessage,
    });
  }
}

import { FastifyReply } from "fastify";

export function handleResponse(
  reply: FastifyReply,
  status: number,
  error?: unknown,
  customMessage?: string,
  responseObject?: object | object[],
) {
  if (!responseObject && error) {
    console.log("error while updating");
    return reply.status(status).send({
      message:
        customMessage ||
        (error instanceof Error ? error.message : "Unknown error"),
      success: false,
    });
  } else {
    return reply.status(status).send({
      data: responseObject,
      message: customMessage,
      success: true,
    });
  }
}

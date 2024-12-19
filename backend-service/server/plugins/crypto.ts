import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import toUint8Array from "base64-to-uint8array";
import fp from "fastify-plugin";
import {
  base64ToArrayBuffer,
  DecryptData,
  handleError,
  prepareKey,
  unwrappedKey,
} from "../helpers/cryptoHelpers";

interface registrationRequestBody {
  requestBody: string;
  iv: string;
  encryptedKey: string;
}

export default fp(async function decryption(app: FastifyInstance, opts) {
  async function decrypt(
    request: FastifyRequest<{ Body: registrationRequestBody }>,
    reply: FastifyReply,
  ) {
    const encryptedKey: ArrayBufferLike = base64ToArrayBuffer(
      request.body.encryptedKey,
    );
    const iv: Uint8Array = toUint8Array(request.body.iv);
    const requestBody = base64ToArrayBuffer(request.body.requestBody);

    try {
      const importedKey: CryptoKey = await prepareKey(app.config.PRIVATE_KEY);
      const unwrappedCryptoKey = await unwrappedKey(importedKey, encryptedKey);
      request.body = await DecryptData(unwrappedCryptoKey, iv, requestBody);
    } catch (error) {
      handleError(reply, error, 500, "Error occuried");
    }
  }
  app.decorate("decryptBodyRequest", decrypt);
});

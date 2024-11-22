import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import toUint8Array from "base64-to-uint8array";
import fp from "fastify-plugin";

interface registrationRequestBody {
  requestBody: string;
  iv: string;
  encryptedKey: string;
}

type modifiedBody = Omit<registrationRequestBody, "iv" | "encryptedKey">;

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function prepareKey(privateKey: string): Promise<CryptoKey> {
  const parsedKey: JsonWebKey = JSON.parse(privateKey);
  return await crypto.subtle.importKey(
    "jwk",
    parsedKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["decrypt", "unwrapKey"],
  );
}

const changeStringToArrayBuffer = (data: string[]): ArrayBuffer[] => {
  return data.map((value) => base64ToArrayBuffer(value));
};

async function unwrappedKey(
  importedKey: CryptoKey,
  encryptedKey: ArrayBuffer,
): Promise<CryptoKey> {
  return await crypto.subtle.unwrapKey(
    "raw",
    encryptedKey,
    importedKey,
    { name: "RSA-OAEP" },
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"],
  );
}

async function DecryptData(
  AESKey: CryptoKey,
  iv: Uint8Array,
  data: ArrayBufferLike,
) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    AESKey,
    data,
  );

  //decode to normal text
  const decoder = new TextDecoder();
  const plaintext = decoder.decode(decrypted);
  return JSON.parse(plaintext);
}

export function handleError(
  reply: FastifyReply,
  error: unknown,
  status: number,
  customMessage?: string,
) {
  console.error(error);
  return reply.status(status).send({
    message:
      customMessage ||
      (error instanceof Error ? error.message : "Unknown error"),
  });
}

export default fp(async function decryption(app: FastifyInstance, opts) {
  async function decrypt(
    request: FastifyRequest<{ Body: registrationRequestBody | modifiedBody }>,
    reply: FastifyReply,
  ) {
    try {
      const privateKey: JsonWebKey = JSON.parse(app.config.PRIVATE_KEY);
      const importedPrivateKey = await crypto.subtle.importKey(
        "jwk",
        privateKey,
        {
          name: "RSA-OAEP",
          hash: { name: "SHA-256" },
        },
        true,
        ["decrypt", "unwrapKey"],
      );

      try {
        const arrayBuffer = base64ToArrayBuffer(
          (request.body as registrationRequestBody).encryptedKey,
        );
        const unwrappedKey = await crypto.subtle.unwrapKey(
          "raw",
          arrayBuffer,
          importedPrivateKey,
          { name: "RSA-OAEP" },
          { name: "AES-GCM" },
          true,
          ["encrypt", "decrypt"],
        );

        try {
          const iv = toUint8Array((request.body as registrationRequestBody).iv);
          const data = base64ToArrayBuffer(request.body.requestBody);
          const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            unwrappedKey,
            data,
          );

          //decode to normal text
          const decoder = new TextDecoder();
          const plaintext = decoder.decode(decrypted);
          request.body = JSON.parse(plaintext);
        } catch (e) {
          console.error(e);
          return reply.status(500).send({
            message: e.message,
          });
        }
      } catch (e) {
        console.error(e);
        return reply.status(500).send({
          message: e.message,
        });
      }
    } catch (e) {
      console.error(e);
      return reply.status(500).send({
        message: e.message,
      });
    }
  }

  app.decorate("decryptBodyRequest", decrypt);
});

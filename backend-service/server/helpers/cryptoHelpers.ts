import { FastifyReply } from "fastify";

export function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function prepareKey(privateKey: string): Promise<CryptoKey> {
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

export const changeStringToArrayBuffer = (data: string[]): ArrayBuffer[] => {
  return data.map((value) => base64ToArrayBuffer(value));
};

export async function unwrappedKey(
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

export async function DecryptData(
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
    success: false,
    message:
      customMessage ||
      (error instanceof Error ? error.message : "Unknown error"),
  });
}

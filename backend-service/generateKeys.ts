import crypto from "crypto";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function genKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  // Create the public key file
  try {
    fs.writeFileSync(
      __dirname + "/id_rsa_public.jwks.json",
      JSON.stringify(publicKey),
    );

    console.log("Keys saved successfully!");
  } catch (error) {
    console.error("Error saving keys:", error);
  }

  try {
    fs.writeFileSync(
      __dirname + "/id_rsa_private.jwks.json",
      JSON.stringify(privateKey),
    );

    console.log("Keys saved successfully!");
  } catch (error) {
    console.error("Error saving keys:", error);
  }
}

await genKeyPair();

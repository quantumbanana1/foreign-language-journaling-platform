import { INewUser } from "../Types/UserTypes";

export default class NewUser {
  private id: number;
  private username: string;
  private email: string;
  private password: string;
  private confirmPassword: string;
  private unique_key: string;

  constructor(
    username: string,
    email: string,
    password: string,
    unique_key: string,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.unique_key = unique_key;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getConfirmPassword(): string {
    return this.confirmPassword;
  }

  public setConfirmPassword(confirmPassword: string): void {
    this.confirmPassword = confirmPassword;
  }

  public toString(): string {
    return `User: { id: ${this.id}, username: ${this.username}, email: ${this.email}, password: ${this.password}, confirmPassword: ${this.confirmPassword} }`;
  }

  public returnUserObject(): INewUser {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      unique_key: this.unique_key,
    };
  }
}

// try {
//   const privateKey: JsonWebKey = JSON.parse(app.config.PRIVATE_KEY);
//   const importedPrivateKey = await crypto.subtle.importKey(
//       "jwk",
//       privateKey,
//       {
//         name: "RSA-OAEP",
//         hash: { name: "SHA-256" },
//       },
//       true,
//       ["decrypt", "unwrapKey"],
//   );

//   try {
//     const arrayBuffer = base64ToArrayBuffer(
//         (request.body as registrationRequestBody).encryptedKey,
//     );
//     const unwrappedKey = await crypto.subtle.unwrapKey(
//         "raw",
//         arrayBuffer,
//         importedPrivateKey,
//         { name: "RSA-OAEP" },
//         { name: "AES-GCM" },
//         true,
//         ["encrypt", "decrypt"],
//     );
//
//     try {
//       const iv = toUint8Array((request.body as registrationRequestBody).iv);
//       const data = base64ToArrayBuffer(request.body.requestBody);
//       const decrypted = await crypto.subtle.decrypt(
//           { name: "AES-GCM", iv },
//           unwrappedKey,
//           data,
//       );
//
//       //decode to normal text
//       const decoder = new TextDecoder();
//       const plaintext = decoder.decode(decrypted);
//       request.body = JSON.parse(plaintext);
//     } catch (e) {
//       console.error(e);
//       return reply.status(500).send({
//         message: e.message,
//       });
//     }
//   } catch (e) {
//     console.error(e);
//     return reply.status(500).send({
//       message: e.message,
//     });
//   }
// } catch (e) {
//   console.error(e);
//   return reply.status(500).send({
//     message: e.message,
//   });
// }

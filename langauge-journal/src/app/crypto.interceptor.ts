import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class cryptoInterceptor implements HttpInterceptor {
  private publicKeyJwk: JsonWebKey = {
    kty: 'RSA',
    e: 'AQAB',
    n: 'uIaBUhB4i3uquTa3cIlozaT2XvRn1pj8Wjndj6e8LQGVqVpQkEEUyereOaVXkxhrsDK7c9tIr355uBo1y99kEqJQIgfR1mUr319nyxkZ53-odW5lpPD7Oquzf8Tf4wSFrTGAUeb5XThyJ7M-KF52LXBPAchFFnE-YeVCIVltFqHalfMLE4NuuFo9d1OdgjDMMV3rXZQeFmTBIo3OtOslXPFoOcJRP3IGmjaVP9R1hpxg8MRdSg4YBMhGCmNT1M75Wjf4Rec6ocmpR6oFoFJMner5gib7B7RealW7SmP-VE28A5l9Br_wWXdPkt2UxU0XF-3_LPIl33md7eMtMu37T4Hp-Y317GHTjHCmkV2X-kwNCcRsvTJnoJw0rqYvUIfzYMDJpkvB7XZSlcqMLgHi97T0pGTe4FpKUv8txSL-_VHaOioyWGobzIEj2430nTdCpryOY6G81itC6tJ76_iQvCh3rRfI-SwIDxRGCaxxtslElBnJbirrMMBpMpOw5SNLqkCJ0X-1GEpeo8TWls1eIuJb_hZf5oXh6-mvpYPpEuSX5KGoaaolmw1w6I-sLntRZJVJ1yw5K4KWKxjV75GKxzjoD1XuatfPaPVVHJNikOUlYhpGNqlDQ6WneHYAFbh-Q7SvtivhIKawiI01iNJS7sn5WGiyLO7dRDs4JUkxYcE',
    alg: 'RSA-OAEP-256',
    ext: true,
  };

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const isMultipart =
      req.headers.has('X-Is-Multipart') ||
      req.headers.get('Content-Type')?.includes('multipart/form-data');

    if (req.method === 'POST' && !isMultipart) {
      console.log('ecnryption jejejeje');
      console.log(req.headers);
      console.log(req.body);
      const key = Buffer.from(
        crypto.getRandomValues(new Uint8Array(32)),
      ).toString('base64');

      return from(this.encryptSymmetric(JSON.stringify(req.body), key)).pipe(
        switchMap((modifiedBody) => {
          const encryptedReq = req.clone({
            body: modifiedBody,
          });
          console.log(encryptedReq);
          return next.handle(encryptedReq);
        }),
        catchError((error) => {
          console.error('Encryption error:', error);
          return of(error);
        }),
      );
    }

    return next.handle(req);
  }

  private async encryptSymmetric(plaintext: string, key: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPlaintext = new TextEncoder().encode(plaintext);

    const secretKey = await crypto.subtle.importKey(
      'raw',
      Buffer.from(key, 'base64'),
      {
        name: 'AES-GCM',
      },
      true,
      ['encrypt', 'decrypt'],
    );

    const publicKey = await this.RSAPublicKey();
    const wrappedKey = await this.wrapKey('raw', secretKey, publicKey);

    console.log(wrappedKey);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      secretKey,
      encodedPlaintext,
    );

    return {
      requestBody: Buffer.from(ciphertext).toString('base64'),
      iv: Buffer.from(iv).toString('base64'),
      encryptedKey: Buffer.from(wrappedKey).toString('base64'),
    };
  }

  private async RSAPublicKey(): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'jwk',
      this.publicKeyJwk,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      true,
      ['encrypt', 'wrapKey'],
    );
  }

  private async wrapKey(
    format: KeyFormat,
    key: CryptoKey,
    wrappingKey: CryptoKey,
  ): Promise<ArrayBuffer> {
    return crypto.subtle.wrapKey(format, key, wrappingKey, {
      name: 'RSA-OAEP',
    });
  }
}

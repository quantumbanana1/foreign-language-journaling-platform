import { Injectable } from '@angular/core';
import { from, of, switchMap } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppCryptoService implements HttpInterceptor {
  private public_key: string =
    'LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUNDZ0tDQWdFQTIwU1o0aWFjdjIxUTVRbjZWNC9iVWxxL3pPc1BTSUlObk9oaFlTY3NvcHhJbTRlVHdLdDkKWmk2UVZxTnZNOE1CRkFzM2xHMWR1S0dyRStINVRiS1BoVVpXOTFLWUpwNHhTL1FLOGxuU0JRQUtGeUdyeU1ZSAp0YXlSbTJwbWR0TFRNOUlFYmVwcVc2RXJpVVFLTFVSS3FRYUtEbEdiNVdkdWQ1OTdDb1JNRmpLbU9jWE8xd0laCmYxcG1MNWVYMEpGaEFyM2NMMk1EN01UUy9pOVp2TmtoS0Jxd2hHcXVuRGFIZzM1ZHRXKzA2ekJKdmlFb2tYbWwKSHRiKzdhNUthaUxOc2MwU2xQVGVleTEyUm1VaWwzaStSRmFueUpHdEF4eHNpbnJaZ0ZyWExFR1pQOW9FZFV6YgpqWDdLWWxaMXltSDJFZWp5UHhJQWp2VmQxTVVqOVQwRXY3N2F0WVdocjlEbnhFMk9OMENLN2wwTE9uSkJLWkZTCm1zaCtQdjkvZElISHVhODhla05IQnAwOTZTSHRRc1lDelJHcFFwUkhHTWFyc3dqWUd2RVFNOCtVOGQ1RldqclcKUWdCWmJnUzZWYW41YWxaV3UxeFo4dlk2UXZoOFZKMnJHbjhQS0Zrd2NDYzFCREFidTRmRW5BUXRrYTZqdGxTWgpnYmpKUHdaK2hwcjJtMDVZRW41TjZRYnl5TExidWVXczRRVVNETE9BbC84RXJmUWdiM3RwTzFhdWpySlpuS0hSClc1UVJUN2JwNnJYeDVsSFB2SmR6S052QXJ5c2RtOGZmZWNoVkpqUTVLLzJaa3ArckxLbDJUNCt3dEdSOXBHc24KOXFDYTlxWEZRVXp3Y3BLcDJsV2tNZ0d2UkJjdFJrVXQwUHdZWllxSTFvWjBadU1iandmUkJza0NBd0VBQVE9PQotLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tCg==';
  private key: string;
  constructor() {
    this.key = Buffer.from(this.public_key, 'base64').toString('ascii');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // let encryptedBody;
    // from(this.generateAESKey()).pipe(
    //   switchMap((key: CryptoKey) => {
    //     return from(this.encryptData(JSON.stringify(req.body), key)).pipe(
    //       switchMap((encryptedData) => {
    //         encryptedBody = encryptedData;
    //         return of(encryptedBody);
    //       }),
    //     );
    //   }),
    // );
    // const encryptedReq = req.clone({
    //   body: {
    //     encryptedData: encryptedBody,
    //   },
    // });
    //
    // return next.handle(encryptedReq);

    // const encryptData = this.encryptData(JSON.stringify(req.body), key);
    // const encryptedData = await encryptData;
    // console.log(encryptedData);
    // return next.handle(req).pipe(
    //   tap((event: HttpEvent<any>) => {
    //     console.log('Incoming HTTP response', event);
    //   }),
    // );
    req = req.clone({
      body: JSON.stringify(req.body),
    });

    return next.handle(req);
  }

  private encryptData(data, key: CryptoKey) {
    return window.crypto.subtle.encrypt({ name: 'AES-CBC' }, key, data);
  }

  private encryptAESKey() {}

  private decryptData() {}

  private async generateAESKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-CBC',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );
  }
}

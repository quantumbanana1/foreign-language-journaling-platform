import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import IRUser, {
  ILUser,
  IUserAttributes,
  IUserAttrToFetch,
} from './types/User/userTypes';
import { catchError, Observable, throwError } from 'rxjs';
import { IUserUpdateResponse } from './types/Response/updateUserInfoResponse';
import { uploadImageResponse } from './types/Response/uploadImageResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}

  public createNewUser(newUser: IRUser) {
    return this.httpClient.post(`${this.API_URL}/registration`, newUser);
  }

  public logInUser(logInUser: ILUser) {
    return this.httpClient.post(`${this.API_URL}/login`, logInUser, {
      withCredentials: true,
    });
  }

  public logOut() {
    return this.httpClient.post(
      `${this.API_URL}/logout`,
      { logOut: true },
      {
        withCredentials: true,
      },
    );
  }

  public authorize() {
    return this.httpClient.get(`${this.API_URL}/auth`, {
      withCredentials: true,
    });
  }

  public getUserInfo(attributes: IUserAttrToFetch) {
    const params = new HttpParams({
      fromObject: attributes as Record<string, any>,
    });
    let options = {
      withCredentials: true,
      params: params,
    };
    return this.httpClient
      .get<IUserAttributes>(`${this.API_URL}/user`, options)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () =>
              error.error.message ||
              new Error('error occured while fetching data'),
          );
        }),
      );
  }

  public uploadProfileImage(img: File): Observable<uploadImageResponse> {
    const formData = new FormData();
    formData.append('profile-image', img);
    const headers = new HttpHeaders({
      'X-Is-Multipart': 'true',
    });

    return this.httpClient
      .post<uploadImageResponse>(
        `${this.API_URL}/upload/image/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: headers,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () =>
              error.error.message || new Error('updating an user image failed'),
          );
        }),
      );
  }

  public updateUserInfo(
    userInfo: Partial<IUserAttributes>,
  ): Observable<IUserUpdateResponse> {
    return this.httpClient
      .patch<IUserUpdateResponse>(
        `${this.API_URL}/update/user-info`,
        userInfo,
        { withCredentials: true },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return throwError(
            () =>
              error.error.message || new Error('updating an user info failed'),
          );
        }),
      );
  }
}

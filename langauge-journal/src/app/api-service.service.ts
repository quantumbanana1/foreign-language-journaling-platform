import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import IRUser, {
  ILUser,
  IUserAttributes,
  IUserAttrToFetch,
} from './types/User/userTypes';
import { catchError, Observable, throwError } from 'rxjs';

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
        catchError((error) => {
          return throwError(
            () => new Error('error occured while fetching data'),
          );
        }),
      );
  }

  public uploadProfileImage(img: File) {
    const formData = new FormData();
    formData.append('profile-image', img);
    const headers = new HttpHeaders({
      'X-Is-Multipart': 'true',
    });

    return this.httpClient
      .post(`${this.API_URL}/upload/image/profile-image`, formData, {
        withCredentials: true,
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('uploading an image failed'));
        }),
      );
  }

  public updateUserInfo(
    userInfo: IUserAttributes,
  ): Observable<IUserAttributes> {
    return this.httpClient
      .patch<IUserAttributes>(`${this.API_URL}/update/user_info}`, userInfo)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('updating an user info failed'));
        }),
      );
  }
}

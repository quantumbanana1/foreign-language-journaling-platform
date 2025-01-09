import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import IRUser, {
  ILUser,
  IUserAttributes,
  IUserAttrToFetch,
} from './types/User/userTypes';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:8080';
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
    return this.httpClient.get<IUserAttributes>(
      `${this.API_URL}/user`,
      options,
    );
  }
}

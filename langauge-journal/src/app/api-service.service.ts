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
import { catchError, Observable, of, throwError } from 'rxjs';
import { IUserUpdateResponse } from './types/Response/updateUserInfoResponse';
import { uploadImageResponse } from './types/Response/uploadImageResponse';
import { ILanguageResponse } from './types/Language/langaugeResponse';
import {
  IChooseLanguageWithLevel,
  IDeleteLanguageResponse,
  IResponseUserLanguages,
} from './types/Language/languageOptionTypes';
import {
  IGetInterestsResponse,
  IInterest,
} from './types/Response/getInterestsResponse';
import { IDeleteInterestResponse } from './types/Interests/interestTypes';
import { INewPostRequest, NewPostResponse } from './types/newPost/newPostTypes';
import { PostResponse } from './types/Response/postTypes';

// ApiService: Handles all HTTP requests to the backend API.

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL: string = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}
  private defaultOptions = { withCredentials: true };

  // Creates a new user by sending a POST request to the registration endpoint.
  public createNewUser(newUser: IRUser) {
    return this.httpClient.post(`${this.API_URL}/registration`, newUser);
  }
  // Logs in a user by sending a POST request to the login endpoint.
  public logInUser(logInUser: ILUser) {
    return this.httpClient.post(
      `${this.API_URL}/login`,
      logInUser,
      this.defaultOptions,
    );
  }

  // Logs out the user by sending a POST request to the logout endpoint.
  public logOut() {
    return this.httpClient.post(
      `${this.API_URL}/logout`,
      { logOut: true },
      this.defaultOptions,
    );
  }

  //Authorizes the user by sending a GET request to the auth endpoint.
  public authorize() {
    return this.httpClient.get(`${this.API_URL}/auth`, this.defaultOptions);
  }

  // Fetches user information based on the specified attributes.
  public getUserInfo(attributes: IUserAttrToFetch) {
    const params = new HttpParams({
      fromObject: attributes as Record<string, any>,
    });
    let options = {
      ...this.defaultOptions,
      params: params,
    };
    return this.httpClient
      .get<IUserAttributes>(`${this.API_URL}/user`, options)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching user information failed'),
        ),
      );
  }
  // Uploads a profile image by sending a POST request with multipart form data.
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
          ...this.defaultOptions,
          headers: headers,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Uploading image profile failed'),
        ),
      );
  }

  public uploadPostImage(img: File): Observable<uploadImageResponse> {
    const formData = new FormData();
    formData.append('post-image', img);
    const headers = new HttpHeaders({
      'X-Is-Multipart': 'true',
    });

    return this.httpClient
      .post<uploadImageResponse>(
        `${this.API_URL}/upload/image/post-image`,
        formData,
        {
          ...this.defaultOptions,
          headers: headers,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Uploading post image  failed'),
        ),
      );
  }

  // Updates user information by sending a PATCH request with the provided data.
  public updateUserInfo(
    userInfo: Partial<IUserAttributes>,
  ): Observable<IUserUpdateResponse> {
    return this.httpClient
      .patch<IUserUpdateResponse>(
        `${this.API_URL}/update/user-info`,
        userInfo,
        this.defaultOptions,
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Updating user info failed'),
        ),
      );
  }

  // Fetches all available languages from the server.
  public getAllLanguages(): Observable<ILanguageResponse> {
    return this.httpClient
      .get<ILanguageResponse>(
        `${this.API_URL}/get/languages`,
        this.defaultOptions,
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching languages failed'),
        ),
      );
  }

  // Uploads user-selected languages to the server.
  public uploadUserLanguage(language: IChooseLanguageWithLevel[]) {
    return this.httpClient
      .post<IChooseLanguageWithLevel>(
        `${this.API_URL}/upload/languages`,
        { data: language },
        this.defaultOptions,
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Uploading user languages failed'),
        ),
      );
  }

  //Fetches the languages associated with the current user
  public getUserLanguages(): Observable<IResponseUserLanguages> {
    return this.httpClient
      .get<IResponseUserLanguages>(
        `${this.API_URL}/get/user/languages`,
        this.defaultOptions,
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching user languages failed'),
        ),
      );
  }
  // Deletes a language associated with the current user.
  public deleteLanguage(
    language: IChooseLanguageWithLevel,
  ): Observable<IDeleteLanguageResponse> {
    const params = new HttpParams().set('language_id', language.language_id);
    return this.httpClient
      .delete<IDeleteLanguageResponse>(`${this.API_URL}/delete/language`, {
        ...this.defaultOptions,
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Deleting language failed'),
        ),
      );
  }
  // Removes an item from the badge, handling different types of items ( languages, hobbies etc.).
  public removeItemFromBadgeButton(item) {
    if (item.type === 'language') {
      return this.deleteLanguage(item);
    }
    return of(null);
  }

  public getInterests(): Observable<IGetInterestsResponse> {
    return this.httpClient
      .get<IGetInterestsResponse>(`${this.API_URL}/get/interests`, {
        ...this.defaultOptions,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching interests failed'),
        ),
      );
  }

  public uploadUserInterest(interest: IInterest) {
    return this.httpClient
      .post(`${this.API_URL}/update/user-interests`, interest, {
        ...this.defaultOptions,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Updating interest failed'),
        ),
      );
  }

  public getUserInterests(): Observable<IGetInterestsResponse> {
    return this.httpClient
      .get<IGetInterestsResponse>(`${this.API_URL}/get/user/interests`, {
        ...this.defaultOptions,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching user interests failed'),
        ),
      );
  }

  public deleteUserInterest(
    language_id: number,
  ): Observable<IDeleteInterestResponse> {
    const params = new HttpParams().set('interest_id', language_id);
    return this.httpClient
      .delete<IDeleteInterestResponse>(`${this.API_URL}/delete/user/interest`, {
        ...this.defaultOptions,
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Deleting user interest failed.'),
        ),
      );
  }

  public uploadNewPost(newPost: INewPostRequest): Observable<NewPostResponse> {
    return this.httpClient
      .post<NewPostResponse>(`${this.API_URL}/upload/new-post`, newPost, {
        ...this.defaultOptions,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Uloading new post failed.'),
        ),
      );
  }

  public getPost(postId: number): Observable<PostResponse> {
    const params = new HttpParams().set('post_id', postId);
    return this.httpClient
      .get<PostResponse>(`${this.API_URL}/get/post`, {
        ...this.defaultOptions,
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching a post failed.'),
        ),
      );
  }

  private handleError(
    error: HttpErrorResponse,
    defaultMessage: string,
  ): Observable<never> {
    return throwError(() => {
      return error.error.message || new Error(defaultMessage);
    });
  }
}

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
  IUserAttributesResponse,
  IUserAttrToFetch,
} from './types/User/userTypes';
import { catchError, Observable, of, throwError } from 'rxjs';
import { IUserUpdateResponse } from './types/Response/updateUserInfoResponse';
import { uploadImageResponse } from './types/Response/uploadImageResponse';
import {
  ILanguage,
  ILanguageResponse,
} from './types/Language/langaugeResponse';
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
import {
  IGetAllPostsResponse,
  IGetUserPostOptions,
  IGetUserPostsResponse,
  ISearchResponse,
  PostResponse,
} from './types/Response/postTypes';
import {
  INewComment,
  IPostCommentsResponse,
  IUpdatedCommentResponse,
  IUpdatedPostComment,
} from './types/newPost/commentTypes';
import { DeleteCommentResponse200 } from './types/comments/commentTypes';
import { IResponseUserPostCounts } from './types/post/postAttributes';

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
    let params = new HttpParams();

    // only send flags that are true
    (
      Object.entries(attributes) as [
        keyof IUserAttrToFetch,
        boolean | undefined,
      ][]
    ).forEach(([key, val]) => {
      if (val === true) {
        params = params.set(String(key), 'true'); // send "true"
      }
    });

    const options = { ...this.defaultOptions, params };

    return this.httpClient
      .get<IUserAttributesResponse>(`${this.API_URL}/get/user`, options)
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

  public getUserLanguagesById(
    userId: number,
  ): Observable<IResponseUserLanguages> {
    return this.httpClient
      .get<IResponseUserLanguages>(
        `${this.API_URL}/get/user/${userId}/languages`,
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

  public getAllPost(): Observable<IGetAllPostsResponse> {
    return this.httpClient
      .get<IGetAllPostsResponse>(`${this.API_URL}/get/posts`, {
        ...this.defaultOptions,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching a post failed.'),
        ),
      );
  }

  public searchPosts(
    searchResult: string,
    followedAuthors: boolean,
    needsFeedback: boolean,
    myLanguages: boolean,
    commentedPost: boolean,
  ): Observable<ISearchResponse> {
    const params = new HttpParams()
      .set('followedAuthors', followedAuthors)
      .set('needsFeedback', needsFeedback)
      .set('searchResult', searchResult)
      .set('myLanguages', myLanguages)
      .set('commentedPost', commentedPost);

    return this.httpClient
      .get<ISearchResponse>(`${this.API_URL}/search/posts`, {
        ...this.defaultOptions,
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching a post failed.'),
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

  public getUserPosts(
    nickname: string,
    options: IGetUserPostOptions,
  ): Observable<IGetUserPostsResponse> {
    let params = new HttpParams();

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    return this.httpClient
      .get<IGetUserPostsResponse>(
        `${this.API_URL}/get/user/${nickname}/posts`,
        {
          ...this.defaultOptions,
          params: params,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'fetching new post information.'),
        ),
      );
  }

  public uploadNewComment(newComment: IUpdatedPostComment) {
    return this.httpClient
      .post<NewPostResponse>(
        `${this.API_URL}/upload/post/comment`,
        newComment,
        {
          ...this.defaultOptions,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Uloading new post failed.'),
        ),
      );
  }

  public getPostComments(postId: number): Observable<IPostCommentsResponse> {
    const params = new HttpParams().set('post_id', postId);
    return this.httpClient
      .get<IPostCommentsResponse>(`${this.API_URL}/get/post/comments`, {
        ...this.defaultOptions,
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Fetching a post failed.'),
        ),
      );
  }

  public updateComment(
    comment: Partial<INewComment>,
    postId: string,
    commentId: number,
  ): Observable<IUpdatedCommentResponse> {
    return this.httpClient
      .patch<IUpdatedCommentResponse>(
        `${this.API_URL}/update/post/${postId}/comment/${commentId}`,
        comment,
        this.defaultOptions,
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Updating comment failed'),
        ),
      );
  }

  public deleteComment(
    post_id: number,
    comment_id: number,
  ): Observable<DeleteCommentResponse200> {
    const params = new HttpParams()
      .set('post_id', post_id)
      .set('comment_id', comment_id);

    return this.httpClient
      .delete<DeleteCommentResponse200>(
        `${this.API_URL}/delete/post/${post_id}/comment/${comment_id}`,
        {
          ...this.defaultOptions,
          params: params,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'Deleting comment failed.'),
        ),
      );
  }

  public countUserPost(user_id: number): Observable<IResponseUserPostCounts> {
    return this.httpClient
      .get<IResponseUserPostCounts>(
        `${this.API_URL}/get/user/${user_id}/amount/posts`,
        {
          ...this.defaultOptions,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleError(error, 'counting  user posts and likes  failed'),
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

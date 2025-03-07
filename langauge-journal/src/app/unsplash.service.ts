import { Injectable } from '@angular/core';
import { environment } from '../../src/enviroment';
import { createApi } from 'unsplash-js';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private unsplashApi;

  constructor() {
    this.unsplashApi = createApi({
      accessKey: environment.unsplashAccessKey,
    });
  }

  public loadImageCollection(query: string): Observable<any> {
    return from(
      this.unsplashApi.search.getPhotos({
        query: query,
        page: 1,
        perPage: 10,
        orientation: 'squarish',
      }),
    );
  }
}

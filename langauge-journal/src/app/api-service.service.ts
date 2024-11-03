import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import IRUser from './types/userTypes';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}

  public createNewUser(newUser: IRUser): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/registration`, newUser);
  }
}

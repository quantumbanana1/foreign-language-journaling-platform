import { computed, effect, Injectable, signal } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthState, Status } from './types/authorizeStatus/authorizeTypes';

@Injectable({
  providedIn: 'root',
})
export class LoggedinService {
  private API_URL = 'http://localhost:8080';

  public authorized$ = new Subject<void>();

  private state = signal<AuthState>({
    status: 'initial',
  });

  status = computed(() => this.state().status);

  public isLoggedIn$: Observable<Status> = this.authorized$.pipe(
    switchMap(() =>
      this.http.get(`${this.API_URL}/auth`, { withCredentials: true }).pipe(
        tap((val) => console.log(val)),
        map(() => 'authenticated' as const),
        catchError(() => of('fail' as const)),
      ),
    ),
  );

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
}

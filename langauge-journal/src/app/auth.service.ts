import { computed, effect, Injectable, signal } from '@angular/core';
import {
  catchError,
  EMPTY,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ILUser } from './types/User/userTypes';
import { AuthState, Status } from './types/authorizeStatus/authorizeTypes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:8080';
  public login$ = new Subject<ILUser>();
  public logout$ = new Subject<void>();
  private LoggedInState: Observable<Status> = this.login$.pipe(
    switchMap((userForm: ILUser) =>
      this.http
        .post(`${this.API_URL}/login`, userForm, {
          withCredentials: true,
        })
        .pipe(
          tap((val) => console.log(val)),
          map(() => 'authenticated' as const),
          catchError(() => of('fail' as const)),
          startWith('authenticating' as const),
        ),
    ),
  );

  private logoutStatus$: Observable<Status> = this.logout$.pipe(
    switchMap(() =>
      this.http
        .post(
          `${this.API_URL}/logout`,
          { logout: true },
          { withCredentials: true },
        )
        .pipe(
          map(() => 'unauthenticated' as const),
          catchError(() => EMPTY),
        ),
    ),
  );

  private state = signal<AuthState>({
    status: 'initial',
  });

  status = computed(() => this.state().status);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    merge(this.LoggedInState, this.logoutStatus$)
      .pipe(
        tap((status) => console.log('status emitted', status)),
        takeUntilDestroyed(),
      )
      .subscribe((status) =>
        this.state.update((currentState) => ({
          ...currentState,
          status: status,
        })),
      );

    effect(() => {
      const status = this.status();
      console.log(status);

      if (status === 'initial' || status === 'unauthenticated') {
        this.router.navigateByUrl('login');
      }

      if (status === 'authenticated') {
        console.log('xxddxdxd');
        this.router.navigateByUrl('my-feed');
      }
    });
  }
}

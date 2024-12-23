import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface IHomepageUser {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedInState = new Subject<boolean>();
  isLoggedInObservable = this.isLoggedInState.asObservable();

  public homePageState = new Subject<IHomepageUser>();

  constructor() {}

  updateLoggedInState(value: boolean) {
    this.isLoggedInState.next(value);
  }

  updateHomePageState(value) {}
}

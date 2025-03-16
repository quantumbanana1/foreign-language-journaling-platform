import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IInterest } from './types/Response/getInterestsResponse';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  public setNewInterest = new BehaviorSubject<IInterest>({
    interest_id: null,
    type: 'interest',
    name: null,
  });
  notifyOfNewInterest = this.setNewInterest.asObservable();

  public deleteUserInterest = new BehaviorSubject<IInterest>({
    interest_id: null,
    type: 'interest',
    name: null,
  });
  notifyOfDeletion = this.deleteUserInterest.asObservable();

  constructor() {}

  setNewInterestToList(interest: IInterest) {
    return this.setNewInterest.next(interest);
  }

  deleteInterest(interest: IInterest) {
    return this.deleteUserInterest.next(interest);
  }
}

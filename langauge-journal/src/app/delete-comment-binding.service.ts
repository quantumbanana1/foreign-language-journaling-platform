import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteCommentBindingService {
  private startDeletingOfCommentSubject = new Subject<{
    commentId: number;
    action: string;
  }>();

  notifyStartDeletingOfComment =
    this.startDeletingOfCommentSubject.asObservable();

  public popUpStateSubject = new Subject<{
    value: boolean;
    commentId: number;
  }>();
  popUpStateObservable = this.popUpStateSubject.asObservable();

  public setStartDeletingOfComment(commentId: number) {
    this.startDeletingOfCommentSubject.next({
      commentId: commentId,
      action: 'deleteComment',
    });
  }

  updatePopUpState(value: boolean, commentId) {
    this.popUpStateSubject.next({ value: value, commentId: commentId });
  }
}

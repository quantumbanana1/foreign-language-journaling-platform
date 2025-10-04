import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteCommentBindingService {
  public startDeletingOfComment = new BehaviorSubject<{
    commentId: number;
    action: string;
  }>({
    commentId: 0,
    action: '',
  });
  notifyStartDeletingOfComment = this.startDeletingOfComment.asObservable();

  public popUpStateSubject = new Subject<{
    value: boolean;
    commentId: number;
  }>();
  popUpStateObservable = this.popUpStateSubject.asObservable();

  public setStartDeletingOfComment(commentId: number) {
    this.startDeletingOfComment.next({
      commentId: commentId,
      action: 'deleteComment',
    });
  }

  updatePopUpState(value: boolean, commentId) {
    this.popUpStateSubject.next({ value: value, commentId: commentId });
  }
}

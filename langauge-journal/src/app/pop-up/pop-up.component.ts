import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DeleteCommentBindingService } from '../delete-comment-binding.service';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss',
})
export class PopUpComponent implements OnInit, OnDestroy {
  popUpState: boolean;

  constructor(
    private deleteCommentBindingService: DeleteCommentBindingService,
  ) {}

  private commentId: number;

  closePopUp() {
    this.popUpState = false;
  }

  private destroy$ = new Subject<void>();

  subscribeToPopUpState() {
    this.deleteCommentBindingService.popUpStateSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.popUpState = true;
        this.commentId = data.commentId;

        console.log('commentId emitted :', this.commentId);
      });
  }

  ngOnInit(): void {
    this.subscribeToPopUpState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startCommentDelete() {
    this.deleteCommentBindingService.setStartDeletingOfComment(this.commentId);
    this.closePopUp();
  }
}

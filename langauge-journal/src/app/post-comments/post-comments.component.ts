import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { CommentsPostComponent } from '../comments-post/comments-post.component';
import { ApiService } from '../api-service.service';
import { IPostComments } from '../types/newPost/commentTypes';
import { Subject, takeUntil } from 'rxjs';
import { DeleteCommentBindingService } from '../delete-comment-binding.service';
import { toastrService } from '../toastr.service';

@Component({
  selector: 'app-post-comments',
  standalone: true,
  imports: [AddCommentComponent, CommentsPostComponent],
  templateUrl: 'post-comments.component.html',
  styleUrl: './post-comments.component.scss',
})
export class PostCommentsComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject<void>();

  public comments: IPostComments[];

  constructor(
    private apiService: ApiService,
    private deleteCommentBindingService: DeleteCommentBindingService,
    private toastr: toastrService,
  ) {}

  @Input() postId!: string;

  private destroyOFCommentDeleteSub$ = new Subject<void>();
  private destroyOFdeleteCommentApiSub = new Subject<void>();

  private getComments(id: number) {
    this.apiService
      .getPostComments(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.comments = response.data;
          }
        },
      });
  }

  ngOnInit(): void {
    this.getComments(Number(this.postId));
    this.subscribeToCommentDelete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.destroyOFCommentDeleteSub$.next();
    this.destroyOFCommentDeleteSub$.complete();

    this.destroyOFdeleteCommentApiSub.next();
    this.destroyOFdeleteCommentApiSub.complete();
  }

  onCommentCreated(newComment: IPostComments) {
    this.comments = [newComment, ...this.comments];
  }

  private deleteComment(commentId: number) {
    this.apiService
      .deleteComment(Number(this.postId), commentId)
      .pipe(takeUntil(this.destroyOFdeleteCommentApiSub))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.success === true) {
            this.comments = this.comments.filter(
              (comment) => Number(comment.comment_id) !== Number(commentId),
            );
          }
        },
        error: (error) => {
          return this.toastr.showToastrMessage('error', error, 'Info');
        },
      });
  }

  subscribeToCommentDelete() {
    this.deleteCommentBindingService.notifyStartDeletingOfComment
      .pipe(takeUntil(this.destroyOFCommentDeleteSub$))
      .subscribe((data) => {
        return this.deleteComment(data.commentId);
      });
  }
}

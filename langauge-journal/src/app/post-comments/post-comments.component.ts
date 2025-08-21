import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { CommentsPostComponent } from '../comments-post/comments-post.component';
import { ApiService } from '../api-service.service';
import { IPostComments } from '../types/newPost/commentTypes';
import { Subject, takeUntil } from 'rxjs';

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

  constructor(private apiService: ApiService) {}

  @Input() postId!: string;

  private getComments(id: number) {
    this.apiService
      .getPostComments(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.comments = response.data;
            console.log(this.comments);
          }
        },
      });
  }

  ngOnInit(): void {
    console.log(this.postId);
    this.getComments(Number(this.postId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCommentCreated(newComment: IPostComments) {
    this.comments = [newComment, ...this.comments];
  }
}

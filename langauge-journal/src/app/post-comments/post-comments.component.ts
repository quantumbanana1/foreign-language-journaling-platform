import { Component, Input } from '@angular/core';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { CommentsPostComponent } from '../comments-post/comments-post.component';

@Component({
  selector: 'app-post-comments',
  standalone: true,
  imports: [AddCommentComponent, CommentsPostComponent],
  templateUrl: './post-comments.c' + 'omponent.html',
  styleUrl: './post-comments.component.scss',
})
export class PostCommentsComponent {
  @Input() postId!: string;
}

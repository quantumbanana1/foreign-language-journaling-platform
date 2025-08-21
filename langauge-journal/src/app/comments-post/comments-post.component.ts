import { Component, Input } from '@angular/core';
import { IPostComments } from '../types/newPost/commentTypes';

@Component({
  selector: 'app-comments-post',
  standalone: true,
  imports: [],
  templateUrl: './comments-post.component.html',
  styleUrl: './comments-post.component.scss',
})
export class CommentsPostComponent {
  @Input() comment!: IPostComments;
  constructor() {}
}

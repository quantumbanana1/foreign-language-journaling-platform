import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IPostComments } from '../types/newPost/commentTypes';

@Component({
  selector: 'app-comments-post',
  standalone: true,
  imports: [],
  templateUrl: './comments-post.component.html',
  styleUrl: './comments-post.component.scss',
})
export class CommentsPostComponent implements OnChanges {
  @Input() comment!: IPostComments;

  @ViewChild('commentContent') commentContentElement: ElementRef;
  @ViewChild('usernameContent') usernameContentElement: ElementRef;
  @ViewChild('imageContent') imageContentElement: ElementRef;
  @ViewChild('dataContent') dataContentElement: ElementRef;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comment']) {
      console.log('Card got comment:', this.comment);
    }
  }
}

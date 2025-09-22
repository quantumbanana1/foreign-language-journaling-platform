import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IPostComments } from '../types/newPost/commentTypes';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api-service.service';
import { toastrService } from '../toastr.service';
import { InputPostBindingService } from '../input-post-binding.service';

@Component({
  selector: 'app-comments-post',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './comments-post.component.html',
  styleUrl: './comments-post.component.scss',
})
export class CommentsPostComponent implements OnChanges, OnInit {
  @Input() comment!: IPostComments;

  public isEditMode: boolean = false;

  @ViewChild('commentContent') commentContentElement: ElementRef;
  @ViewChild('usernameContent') usernameContentElement: ElementRef;
  @ViewChild('imageContent') imageContentElement: ElementRef;
  @ViewChild('dataContent') dataContentElement: ElementRef;
  private postId: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: toastrService,
    private inputBindingsService: InputPostBindingService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comment']) {
      console.log('Card got comment:', this.comment);
    }
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
  }

  public setEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  updateComment() {
    const data = {
      content: this.comment.content,
      comment_id: this.comment.comment_id,
      userId: this.comment.user_id,
      postId: this.comment.post_id,
    };

    console.log(data);

    if (this.comment.content !== '') {
      this.apiService
        .updateComment(data, this.postId, this.comment.comment_id)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.showToastrMessage(
                'success',
                'you updated your comment',
              );
              this.isEditMode = false;
            }
          },
          error: (err) => {
            this.toastr.showToastrMessage(
              'error',
              'error occurred when updating comment, try later',
            );
            this.isEditMode = false;
          },
        });
    }
  }

  popUpState(b: boolean) {
    this.inputBindingsService.updatePopUpState(b);
  }
}

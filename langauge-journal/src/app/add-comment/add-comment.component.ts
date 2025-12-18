import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IPostComments } from '../types/newPost/commentTypes';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.scss',
})
export class AddCommentComponent implements OnInit {
  public textAreaForm: FormGroup;
  private postId: string;
  @Output() commentCreated = new EventEmitter<IPostComments>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private sanitize: DomSanitizer,
    private route: ActivatedRoute,
  ) {
    this.textAreaForm = fb.group({
      textarea: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onSubmit() {
    const sanitizedHTML = this.sanitize.bypassSecurityTrustHtml(
      this.textAreaForm.value.textarea,
    );
    const request = {
      content: sanitizedHTML as string,
      postId: Number(this.postId),
    };

    return this.apiService.uploadNewComment(request).subscribe({
      next: (response) => {
        this.commentCreated.emit(response.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
  }
}

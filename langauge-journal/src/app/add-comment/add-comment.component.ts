import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

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
    // const sanitizedHTML = this.sanitize.bypassSecurityTrustHtml(
    //   this.textAreaForm.value.textarea.content,
    // );
    const request = {
      content: this.textAreaForm.value.textarea,
      postId: this.postId,
    };

    console.log(request);
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
  }
}

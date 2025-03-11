import { Component, OnInit } from '@angular/core';
import { HeaderPostComponent } from '../header-post/header-post.component';
import { FiltersBlockComponent } from '../filters-block/filters-block.component';
import { SelectionBlockPostComponent } from '../selection-block-post/selection-block-post.component';
import { PostButtonsBlockComponent } from '../post-buttons-block/post-buttons-block.component';
import { HeaderEditorComponent } from '../header-editor/header-editor.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { PopUpBlockNewPostImgComponent } from '../pop-up-block-new-post-img/pop-up-block-new-post-img.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-form-block',
  standalone: true,
  imports: [
    HeaderPostComponent,
    FiltersBlockComponent,
    SelectionBlockPostComponent,
    PostButtonsBlockComponent,
    HeaderEditorComponent,
    TextEditorComponent,
    PopUpBlockNewPostImgComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form-block.component.html',
  styleUrl: './form-block.component.scss',
})
export class FormBlockComponent implements OnInit {
  public newPostForm!: FormGroup;

  public selectedLanguage: string = '';

  constructor(
    private fb: FormBuilder,
    private sanitize: DomSanitizer,
  ) {}

  getNotification(emittedData: string) {
    this.selectedLanguage = emittedData;
    console.log(this.selectedLanguage);
  }

  private buildForm() {
    this.newPostForm = this.fb.group({
      basicInfo: this.fb.group({
        title: ['', [Validators.maxLength(5), Validators.required]],
        language: [],
        interests: this.fb.array([], Validators.maxLength(5)),
      }),
      post_info: this.fb.group({
        data: [],
        image: [],
      }),
      postContent: this.fb.group({
        content: new FormControl('', [Validators.required]),
      }),
    });
  }

  onSubmit() {
    const sanitizedHTML = this.sanitize.bypassSecurityTrustHtml(
      this.newPostForm.value.postContent.content,
    );
    const request = {
      ...this.newPostForm.value,
      postContent: {
        ...this.newPostForm.value.postContent,
        content: sanitizedHTML,
      },
    };

    console.log(request);
  }

  ngOnInit() {
    this.buildForm();
  }

  protected readonly onsubmit = onsubmit;
}

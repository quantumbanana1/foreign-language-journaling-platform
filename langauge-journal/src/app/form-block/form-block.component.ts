import { Component, OnInit } from '@angular/core';
import { HeaderPostComponent } from '../header-post/header-post.component';
import { FiltersBlockComponent } from '../filters-block/filters-block.component';
import { SelectionBlockPostComponent } from '../selection-block-post/selection-block-post.component';
import { PostButtonsBlockComponent } from '../post-buttons-block/post-buttons-block.component';
import { HeaderEditorComponent } from '../header-editor/header-editor.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { PopUpBlockNewPostImgComponent } from '../pop-up-block-new-post-img/pop-up-block-new-post-img.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  getNotification(emittedData: string) {
    this.selectedLanguage = emittedData;
    console.log(this.selectedLanguage);
  }

  private buildForm() {
    this.newPostForm = this.fb.group({
      basicInfo: this.fb.group({
        title: [],
        language: [],
        interests: this.fb.array([]),
      }),
      post_info: this.fb.group({
        data: [],
        user_id: [],
        image: [],
      }),
      post_content: this.fb.group({
        post_content: [],
      }),
    });
  }

  onSubmit() {
    console.log(this.newPostForm.value);
  }

  ngOnInit() {
    this.buildForm();
  }

  protected readonly onsubmit = onsubmit;
}

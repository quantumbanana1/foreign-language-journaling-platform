import { Component } from '@angular/core';
import {HeaderPostComponent} from "../header-post/header-post.component";
import {FiltersBlockComponent} from "../filters-block/filters-block.component";
import {SelectionBlockPostComponent} from "../selection-block-post/selection-block-post.component";
import {PostButtonsBlockComponent} from "../post-buttons-block/post-buttons-block.component";
import {HeaderEditorComponent} from "../header-editor/header-editor.component";
import {TextEditorComponent} from "../text-editor/text-editor.component";
import {PopUpBlockNewPostImgComponent} from "../pop-up-block-new-post-img/pop-up-block-new-post-img.component";

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
    PopUpBlockNewPostImgComponent
  ],
  templateUrl: './form-block.component.html',
  styleUrl: './form-block.component.scss'
})
export class FormBlockComponent {

  public selectedLanguage: string = '';

  getNotification(emittedData: string) {
    this.selectedLanguage = emittedData;
    console.log(this.selectedLanguage)


  }
}

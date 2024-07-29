import { Component } from '@angular/core';
import {HeaderPostComponent} from "../header-post/header-post.component";
import {FiltersBlockComponent} from "../filters-block/filters-block.component";
import {SelectionBlockPostComponent} from "../selection-block-post/selection-block-post.component";
import {PostButtonsBlockComponent} from "../post-buttons-block/post-buttons-block.component";

@Component({
  selector: 'app-form-block',
  standalone: true,
  imports: [
    HeaderPostComponent,
    FiltersBlockComponent,
    SelectionBlockPostComponent,
    PostButtonsBlockComponent
  ],
  templateUrl: './form-block.component.html',
  styleUrl: './form-block.component.scss'
})
export class FormBlockComponent {

}

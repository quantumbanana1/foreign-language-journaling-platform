import { Component } from '@angular/core';
import {FormBlockComponent} from "../form-block/form-block.component";

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    FormBlockComponent
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {

}

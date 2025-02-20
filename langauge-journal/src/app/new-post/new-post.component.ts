import { Component } from '@angular/core';
import { FormBlockComponent } from '../form-block/form-block.component';
import { PopUpBlockNewPostImgComponent } from '../pop-up-block-new-post-img/pop-up-block-new-post-img.component';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [FormBlockComponent, PopUpBlockNewPostImgComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  constructor() {}
}

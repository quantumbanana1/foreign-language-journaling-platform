import { Component } from '@angular/core';
import { FormBlockComponent } from '../form-block/form-block.component';
import { PopUpBlockNewPostImgComponent } from '../pop-up-block-new-post-img/pop-up-block-new-post-img.component';
import { SideBarProfileComponent } from '../side-bar-profile/side-bar-profile.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormBlockComponent,
    PopUpBlockNewPostImgComponent,
    SideBarProfileComponent,
    RouterOutlet,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  destinationName: string = 'Edit your profile';
}

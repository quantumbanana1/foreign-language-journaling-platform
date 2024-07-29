import { Component } from '@angular/core';
import {LanguageIndicatorComponent} from "../language-indicator/language-indicator.component";
import {InterestsIndicatorComponent} from "../interests-indicator/interests-indicator.component";

@Component({
  selector: 'app-header-post',
  standalone: true,
  imports: [
    LanguageIndicatorComponent,
    InterestsIndicatorComponent
  ],
  templateUrl: './header-post.component.html',
  styleUrl: './header-post.component.scss'
})
export class HeaderPostComponent {

}

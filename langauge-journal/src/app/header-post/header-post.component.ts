import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LanguageIndicatorComponent} from "../language-indicator/language-indicator.component";
import {InterestsIndicatorComponent} from "../interests-indicator/interests-indicator.component";
import {InputPostBindingService} from "../input-post-binding.service";

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
export class HeaderPostComponent implements OnInit {

  public title: string = ''
  @ViewChild('titleElement') titleElement: ElementRef;

  constructor(private inputBindingsService: InputPostBindingService) { }

  ngOnInit() {

    this.inputBindingsService.inputData.subscribe((data:string) => {
      this.title = data;
      if (this.title === '') {

      }

    })
  }

}

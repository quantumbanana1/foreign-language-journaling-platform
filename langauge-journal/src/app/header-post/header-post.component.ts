import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LanguageIndicatorComponent} from "../language-indicator/language-indicator.component";
import {InterestsIndicatorComponent} from "../interests-indicator/interests-indicator.component";
import {InputPostBindingService} from "../input-post-binding.service";
import {CommonModule} from "@angular/common";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header-post',
  standalone: true,
  imports: [
    LanguageIndicatorComponent,
    InterestsIndicatorComponent,
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './header-post.component.html',
  styleUrl: './header-post.component.scss'
})
export class HeaderPostComponent implements OnInit {

  public title: string = ''
  @ViewChild('TitleElement') titleElement: ElementRef;
  @Input() selectedLanguage!: string;
  rowTitleState: boolean = false;
  public formattedData: string;
  private currentDate: Date = new Date();

  constructor(private inputBindingsService: InputPostBindingService, private datePipe: DatePipe) {
    this.formattedData = this.datePipe.transform(this.currentDate, 'MMMM d, yyyy');
  }

  ngOnInit() {

    this.subscribeToTitle();
    console.log(this.formattedData)
  }

  subscribeToTitle() {
    this.inputBindingsService.inputData.subscribe((data:string) => {
      this.title = data;
      if (this.title === '') {
        this.rowTitleState = false;

      }

      if (this.title !== '') {
        this.rowTitleState = true;
      }

    })
  }

  chooseImg(event: Event) {
    event.preventDefault();
    this.inputBindingsService.updatePopUpState(true);
  }
}

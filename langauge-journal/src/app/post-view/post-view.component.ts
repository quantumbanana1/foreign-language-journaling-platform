import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { HeaderPostComponent } from '../header-post/header-post.component';
import { InterestsIndicatorComponent } from '../interests-indicator/interests-indicator.component';
import { LanguageIndicatorComponent } from '../language-indicator/language-indicator.component';
import { DatePipe, NgIf, NgStyle } from '@angular/common';
import { ApiService } from '../api-service.service';
import { InterestIndicatorStaticComponent } from '../interest-indicator-static/interest-indicator-static.component';
import { IPostObject } from '../types/Response/postTypes';
import { LikesComponent } from '../likes/likes.component';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    HeaderPostComponent,
    InterestsIndicatorComponent,
    LanguageIndicatorComponent,
    NgIf,
    NgStyle,
    InterestIndicatorStaticComponent,
    LikesComponent,
  ],
  providers: [DatePipe],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
})
export class PostViewComponent implements OnInit, AfterViewInit {
  constructor(
    private apiService: ApiService,
    protected datePipe: DatePipe,
    private renderer: Renderer2,
  ) {}
  title: string;
  username: string;
  selectedLanguage: string;
  postContent: string;
  @Input() postId!: string;

  @ViewChild('postContent') postContentElement: ElementRef;

  @Input() postInfo!: IPostObject;
  @Input() postDate!: Date;

  setPostContent() {
    if (this.postContentElement) {
      this.renderer.setProperty(
        this.postContentElement.nativeElement,
        'innerHTML',
        this.postInfo.post_content,
      );
    }

    console.log(this.postContentElement.nativeElement.innerHTML);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setPostContent();
  }
}

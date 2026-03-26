import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IPostObject } from '../types/Response/postTypes';
import { DatePipe, NgIf, NgStyle } from '@angular/common';
import { ApiService } from '../api-service.service';
import { HeaderPostComponent } from '../header-post/header-post.component';
import { InterestIndicatorStaticComponent } from '../interest-indicator-static/interest-indicator-static.component';
import { LikesComponent } from '../likes/likes.component';
import { LanguageIndicatorComponent } from '../language-indicator/language-indicator.component';
import { InterestsIndicatorComponent } from '../interests-indicator/interests-indicator.component';

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
  private viewReady: boolean;
  constructor(
    private apiService: ApiService,
    protected datePipe: DatePipe,
    private renderer: Renderer2,
  ) {}

  title: string;
  username: string;
  selectedLanguage: string;
  private _postContentElement: ElementRef;

  @Input() postId!: string;

  @ViewChild('postContent') set postContentElement(el: ElementRef) {
    if (el) {
      this._postContentElement = el;
      this.setPostContent();
    }
  }

  @Input() postInfo!: IPostObject;
  @Input() postDate!: Date;

  setPostContent() {
    if (this._postContentElement && this.postInfo?.post_content) {
      this.renderer.setProperty(
        this._postContentElement.nativeElement,
        'innerHTML',
        this.postInfo.post_content,
      );
    }
  }

  ngAfterViewInit() {}

  ngOnInit(): void {}
}

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
import { IPostObject, PostResponse } from '../types/Response/postTypes';
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
  formattedData: string;
  username: string;
  selectedLanguage: string;
  postImageUrl: string;
  postContent: string;
  @Input() postId!: string;
  public postInfo: IPostObject;
  public formattedDate: string;
  public postDate;
  @ViewChild('postContent') postContentElement: ElementRef;

  private getPost() {
    this.apiService.getPost(Number(this.postId)).subscribe({
      next: (response) => {
        this.postInfo = response.data;
        this.postDate = new Date(this.postInfo.time_created);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

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

  ngOnInit(): void {
    this.getPost();
  }

  ngAfterViewInit() {
    this.setPostContent();
  }
}

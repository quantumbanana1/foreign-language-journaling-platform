import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LngLevelComponent } from '../lng-level/lng-level.component';
import { ApiService } from '../api-service.service';
import { IPostObject } from '../types/Response/postTypes';
import { Subject, takeUntil } from 'rxjs';
import {
  IChooseLanguageWithLevel,
  IResponseUserLanguages,
} from '../types/Language/languageOptionTypes';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { IResponseUserPostCounts } from '../types/post/postAttributes';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [LngLevelComponent, NgOptimizedImage, NgIf],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private apiService: ApiService) {}

  @Input() postId!: string;
  @Input() postInfo!: IPostObject;

  public languages: IChooseLanguageWithLevel[];

  public createdPostCount: number;
  public userPostLikesCount: number;

  private destroy$ = new Subject<void>();
  private postAttributesDestroy$ = new Subject<void>();

  getUserLanguages() {
    this.apiService
      .getUserLanguagesById(Number(this.postInfo.user_id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IResponseUserLanguages) => {
          this.languages = response.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCountedPostAttributes() {
    this.apiService
      .countUserPost(this.postInfo.user_id)
      .pipe(takeUntil(this.postAttributesDestroy$))
      .subscribe({
        next: (response: IResponseUserPostCounts) => {
          this.createdPostCount = response.data.post_count;
          this.userPostLikesCount = response.data.likes_count;
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.postAttributesDestroy$.next();
    this.postAttributesDestroy$.complete();
  }

  ngAfterViewInit(): void {
    this.getUserLanguages();
    this.getCountedPostAttributes();
  }
}

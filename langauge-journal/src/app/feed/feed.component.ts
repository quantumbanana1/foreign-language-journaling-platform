import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../api-service.service';
import {
  IGetAllPostsResponse,
  IPostObject,
  PostResponse,
} from '../types/Response/postTypes';
import { Subject, takeUntil } from 'rxjs';
import { response } from 'express';
import { FeedPostComponent } from '../feed-post/feed-post.component';
import {
  ILanguage,
  ILanguageResponse,
} from '../types/Language/langaugeResponse';
import { SelectionBlockComponent } from '../selection-block/selection-block.component';
import {
  IGetInterestsResponse,
  IInterest,
} from '../types/Response/getInterestsResponse';

interface singalForBoxToggle {
  value: boolean;
  action: string;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    SideBarComponent,
    RouterOutlet,
    NgIf,
    FeedPostComponent,
    SelectionBlockComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnDestroy, OnInit {
  constructor(private apiService: ApiService) {}

  private destroy$ = new Subject<void>();

  public username: string = '';
  public fetchedPosts: IPostObject[];
  public languages: ILanguage[];
  interests: IInterest[];

  private readonly error = signal<string | null>(null);

  private readonly toggleSearchAdvancedBox = signal<singalForBoxToggle>({
    value: false,
    action: 'Show',
  });

  errorMessage = this.error;
  advancedBox = this.toggleSearchAdvancedBox;

  private getAllPosts() {
    this.apiService
      .getAllPost()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetAllPostsResponse) => {
          this.fetchedPosts = response.data;
          console.log(this.fetchedPosts);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  getLanguages() {
    this.apiService
      .getAllLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ILanguageResponse) => {
          this.languages = response.data;
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  getInterests() {
    this.apiService
      .getInterests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetInterestsResponse) => {
          this.interests = response.data;
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  toggleAdvancedSearchBox() {
    this.toggleSearchAdvancedBox.update((current) => ({
      value: !current.value,
      action: !current.value ? 'Close' : 'Show',
    }));
  }

  ngOnInit(): void {
    this.getAllPosts();
    this.getLanguages();
    this.getInterests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

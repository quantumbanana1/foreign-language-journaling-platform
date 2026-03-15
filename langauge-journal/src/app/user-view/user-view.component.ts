import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
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
import { Router } from '@angular/router';
import { FollowingStatus } from '../types/followingStatus/followinStatus';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [LngLevelComponent, NgOptimizedImage, NgIf],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  @Input() postId!: string;
  @Input() postInfo!: IPostObject;

  public languages: IChooseLanguageWithLevel[] = [];
  public createdPostCount: number = 0;
  public userPostLikesCount: number = 0;

  // Single destroy$ for all subscriptions
  private destroy$ = new Subject<void>();

  public readonly followingStatus: WritableSignal<FollowingStatus> =
    signal<FollowingStatus>({
      isFollow: false,
      isSameUser: false,
    });

  getUserLanguages() {
    this.apiService
      .getUserLanguagesById(Number(this.postInfo.user_id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IResponseUserLanguages) => {
          this.languages = response.data;
        },
        error: (err) => {
          console.error('Failed to load user languages:', err);
        },
      });
  }

  getCountedPostAttributes() {
    this.apiService
      .countUserPost(this.postInfo.user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IResponseUserPostCounts) => {
          this.createdPostCount = response.data.post_count;
          this.userPostLikesCount = response.data.likes_count;
        },
        error: (err) => {
          console.error('Failed to load post attributes:', err);
        },
      });
  }

  goToProfile() {
    this.router.navigate(['/profile', this.postInfo.username]);
  }

  followUser(user_id: number) {
    this.apiService
      .followUser(user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.followingStatus.set({
            isFollow: r.followingStatus,
            isSameUser: false,
          });
        },
        error: (err) => {
          console.error('Failed to follow user:', err);
        },
      });
  }

  unfollowUser(userId: number) {
    this.apiService
      .unfollowUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.followingStatus.set({
            isFollow: false,
            isSameUser: false,
          });
        },
        error: (err) => {
          console.error('Failed to unfollow user:', err);
        },
      });
  }

  checkIfFollow(userId: number) {
    console.log('checking if follwong');
    this.apiService
      .isUserFollowing(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          console.log(r);

          this.followingStatus.set({
            isFollow: r.followingStatus,
            isSameUser: r.isSameUser,
          });
        },
        error: (err) => {
          console.error('Failed to check follow status:', err);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.checkIfFollow(this.postInfo.user_id);
    this.getUserLanguages();
    this.getCountedPostAttributes();
  }

  ngAfterViewInit(): void {
    if (!this.postInfo) return;
  }
}

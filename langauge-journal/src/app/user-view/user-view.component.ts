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

  public languages: IChooseLanguageWithLevel[];

  public createdPostCount: number;
  public userPostLikesCount: number;

  private destroy$ = new Subject<void>();
  private postAttributesDestroy$ = new Subject<void>();

  private readonly followStatus: WritableSignal<FollowingStatus> =
    signal<FollowingStatus>({
      isFollow: false,
      isSameUser: false,
    });

  followingStatus: WritableSignal<FollowingStatus> = this.followStatus;

  getUserLanguages() {
    console.log(this.postInfo);

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

  goToProfile() {
    this.router.navigate(['/profile', this.postInfo.username]);
  }

  followUser(user_id: number) {
    this.apiService
      .followUser(user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          if (r.followingStatus) {
            this.followStatus.set({
              isFollow: true,
              isSameUser: false,
            });
          }
        },

        error: (e) => {},
      });
  }

  unfollowUser(userId: number) {}

  checkIfFollow(userId: number) {
    this.apiService.isUserFollowing(userId).subscribe({
      next: (r) => {
        this.followingStatus.set({
          isFollow: r.followingStatus,
          isSameUser: r.isSameUser,
        });
      },

      error: (e) => {},
    });
  }

  ngOnInit() {
    this.checkIfFollow(this.postInfo.user_id);
  }

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

import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  IUserAttributes,
  IUserAttributesResponse,
  IUserProfile,
} from '../types/User/userTypes';
import { ApiService } from '../api-service.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { response } from 'express';
import { IGetInterestsResponse } from '../types/Response/getInterestsResponse';
import { HelperService } from '../helper.service';
import { ActivatedRoute } from '@angular/router';
import { IGetUserPostOptions, IUserPost } from '../types/Response/postTypes';
import { PublishedPostsComponent } from '../published-posts/published-posts.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PublishedPostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: IUserProfile = {
    username: '',
    name: '',
    city: '',
    country: '',
    profile_photo_url: '',
    description: '',
    user_speaks: '',
    user_learns: '',
    user_likes: '',
    email: '',
  };

  public arrayOfUserPosts: IUserPost[];

  private username: string;

  $destroySubscription = new Subject<void>();

  constructor(
    private api: ApiService,
    private helperService: HelperService,
    private route: ActivatedRoute,
  ) {}

  public getUserInformation() {
    forkJoin({
      getUserInfo: this.api.getUserInfo({
        username: true,
        city: true,
        country: true,
        profile_photo_url: true,
        description: true,
        created_at: true,
        name: true,
      }),
      getUserInterests: this.api.getUserInterests(),
      getUserLang: this.api.getUserLanguages(),
    })
      .pipe(takeUntil(this.$destroySubscription))
      .subscribe({
        next: (response) => {
          //populate user with user Info from first observable
          this.user.city = response.getUserInfo.data.city;
          this.user.country = response.getUserInfo.data.country;
          this.user.profile_photo_url =
            response.getUserInfo.data.profile_photo_url;
          this.user.name = response.getUserInfo.data.name;
          this.user.description = response.getUserInfo.data.description;

          // populate user with interests
          this.user.user_likes = response.getUserInterests.data
            .map((interest) => interest.name)
            .join(', ');

          //populate user with languages
          this.user.user_speaks = response.getUserLang.data
            .filter((l) => l.proficiency === 'native')
            .map((l) => l.name)
            .join(', ');

          this.user.user_learns = response.getUserLang.data
            .filter((l) => l.proficiency !== 'native')
            .map((l) => l.name)
            .join(', ');
        },

        error: (err) => {
          console.log(err);
        },
      });
  }

  private getUserPosts(username: string, options: IGetUserPostOptions) {
    console.log(username);

    this.api
      .getUserPosts(username, options)
      .pipe(takeUntil(this.$destroySubscription))
      .subscribe({
        next: (response) => {
          this.arrayOfUserPosts = response.data;
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    this.getUserInformation();
    this.getUserPosts(this.username, {
      limit: 20,
      offset: 0,
      order: 'asc',
      time_created: true,
      id: true,
      like_count: true,
      comments_count: true,
      image_url: true,
      post_content: true,
      title: true,
      status: 'published',
    });
  }

  ngOnDestroy(): void {
    this.$destroySubscription.next();
    this.$destroySubscription.complete();
  }
}

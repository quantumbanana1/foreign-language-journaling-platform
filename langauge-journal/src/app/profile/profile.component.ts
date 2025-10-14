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
import { Subject, takeUntil } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  public user: IUserProfile;

  $destroyGettingUserInformation = new Subject<void>();

  constructor(private api: ApiService) {}

  public getUserInformation() {
    this.api
      .getUserInfo({
        username: true,
        city: true,
        country: true,
        profile_photo_url: true,
        description: true,
        created_at: true,
        name: true,
      })
      .pipe(takeUntil(this.$destroyGettingUserInformation))
      .subscribe({
        next: (response: IUserAttributesResponse) => {
          this.user.city = response.data.city;
          this.user.country = response.data.country;
          this.user.profile_photo_url = response.data.profile_photo_url;
          this.user.name = response.data.name;
          this.user.description = response.data.description;
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.api
      .getUserInterests()
      .pipe(takeUntil(this.$destroyGettingUserInformation))
      .subscribe({
        next: (response) => {
          console.log(response);
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit() {
    this.getUserInformation();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.$destroyGettingUserInformation.next();
    this.$destroyGettingUserInformation.complete();
  }
}

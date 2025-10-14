import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-service.service';
import { NgOptimizedImage } from '@angular/common';
import { ImageUploadService } from '../image-upload.service';
import {
  IUserAttributes,
  IUserAttributesResponse,
} from '../types/User/userTypes';

@Component({
  selector: 'app-nav-profle',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './nav-profle.component.html',
  styleUrl: './nav-profle.component.scss',
})
export class NavProfleComponent implements OnInit {
  public username: string;
  public photo_url: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private imageService: ImageUploadService,
  ) {}

  goToProfile() {
    this.router.navigate(['profile']);
  }

  getUsername() {
    this.apiService.getUserInfo({ username: true }).subscribe((res) => {
      this.username = res.data.username;
    });
  }

  getNewProfilePhoto() {
    this.imageService.notifyUrlPicturePhotoUrlChange.subscribe((url) => {
      this.photo_url = url;
    });
  }

  getProfilePhoto() {
    this.apiService
      .getUserInfo({ profile_photo_url: true })
      .subscribe((response: IUserAttributesResponse) => {
        this.photo_url = response.data.profile_photo_url;
      });
  }

  ngOnInit() {
    this.getUsername();
    this.getProfilePhoto();
    this.getNewProfilePhoto();
  }
}

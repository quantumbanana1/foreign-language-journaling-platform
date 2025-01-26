import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IUserAttributes } from '../types/User/userTypes';
import { ApiService } from '../api-service.service';
import { ImageUploadService } from '../image-upload.service';
import { successUploadImageResponse } from '../types/Response/uploadImageResponse';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-profile-details-form',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, NgIf],
  templateUrl: './profile-details-form.component.html',
  styleUrl: './profile-details-form.component.scss',
})
export class ProfileDetailsFormComponent implements OnInit {
  userInfoForm: FormGroup;
  public userInfo: IUserAttributes = {
    username: '',
    email: '',
    name: '',
    profile_photo_url: '',
    description: '',
    city: '',
    country: '',
  };
  public photoUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private imageService: ImageUploadService,
    private helperService: HelperService,
  ) {}

  getUserInfo() {
    this.apiService
      .getUserInfo({
        username: true,
        email: true,
        city: true,
        country: true,
        description: true,
        name: true,
        profile_photo_url: true,
      })
      .subscribe((response: IUserAttributes) => {
        this.userInfo = response;
        this.photoUrl = response.profile_photo_url;
        this.buildForm();
      });
  }
  buildForm() {
    console.log(this.userInfo);
    this.userInfoForm = new FormGroup({
      username: new FormControl(this.userInfo.username, [
        Validators.minLength(5),
        Validators.maxLength(15),
      ]),
      email: new FormControl(this.userInfo.email || '', [
        Validators.email,
        Validators.required,
      ]),
      name: new FormControl(this.userInfo.name || '', [
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(/^[A-Za-z\s]*$/), // Updated pattern for names
      ]),
      city: new FormControl(this.userInfo.city || '', [
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z\s]*$/), // Updated pattern for cities
      ]),
      country: new FormControl(this.userInfo.country || '', [
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z\s]*$/), // Updated pattern for countries
      ]),
      description: new FormControl(this.userInfo.description || '', [
        Validators.maxLength(200),
      ]),
    });
  }

  // populateForm() {
  //   console.log(this.userInfo);
  //   this.userInfoForm.setValue({
  //     username: this.userInfo.username,
  //     email: this.userInfo.email,
  //     city: this.userInfo.city,
  //     country: this.userInfo.country,
  //     description: this.userInfo.country,
  //     name: this.userInfo.name,
  //   });
  // }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.apiService
      .uploadProfileImage(file)
      .subscribe((response: successUploadImageResponse) => {
        this.photoUrl = response.url;
        this.imageService.setNewProfilePhotoUrl(response.url);
      });
  }

  onSubmit() {
    const filteredUserInfo = this.helperService.filterChangedPropertiesInObject(
      this.userInfo,
      this.userInfoForm.value,
    );
    console.log(filteredUserInfo);
  }

  ngOnInit() {
    this.getUserInfo();
  }
}

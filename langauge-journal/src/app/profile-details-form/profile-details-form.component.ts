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
import { failedUploadImageResponse } from '../types/Response/uploadImageResponse';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { HelperService } from '../helper.service';
import { IUserUpdateResponse } from '../types/Response/updateUserInfoResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-details-form',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, NgIf],
  templateUrl: './profile-details-form.component.html',
  styleUrl: './profile-details-form.component.scss',
})
export class ProfileDetailsFormComponent implements OnInit {
  public backendMessage = '';
  public userInfo: IUserAttributes = {
    username: '',
    email: '',
    name: '',
    description: '',
    city: '',
    country: '',
  };
  public photoUrl = '';
  public userInfoForm:
    | FormGroup<{}>
    | FormGroup<{
        username: FormControl<string>;
        email: FormControl<string>;
        name: FormControl<string>;
        city: FormControl<string>;
        country: FormControl<string>;
        description: FormControl<string>;
      }>;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private imageService: ImageUploadService,
    private helperService: HelperService,
    private toastr: ToastrService,
  ) {
    this.userInfoForm = this.formBuilder.group({
      username: ['', [Validators.minLength(5), Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.required]],
      name: [
        '',
        [Validators.maxLength(15), Validators.pattern(/^[A-Za-z\s]*$/)],
      ],
      city: [
        '',
        [Validators.maxLength(100), Validators.pattern(/^[A-Za-z\s]*$/)],
      ],
      country: [
        '',
        [
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\s]*$/), // Updated pattern for countries
        ],
      ],
      description: ['', [Validators.maxLength(400)]],
    });
  }

  private showToastrMessage(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
  ) {
    const opt = {
      closeButton: true,
      progressBar: true,
      disableTimeOut: false,
    };

    switch (type) {
      case 'success':
        return this.toastr.success(message, title || 'Success', opt);
      case 'error':
        return this.toastr.error(message, title || 'Error', opt);
      case 'warning':
        return this.toastr.warning(message, title || 'Warning', opt);
      case 'info':
        return this.toastr.info(message, title || 'Info', opt);
      default:
        return this.toastr.show(message, title || '', opt);
    }
  }

  getUserInfo() {
    this.apiService
      .getUserInfo({
        username: true,
        email: true,
        city: true,
        country: true,
        description: true,
        name: true,
      })
      .subscribe((response: IUserAttributes) => {
        this.userInfo = response;
        if (this.userInfo) {
          this.buildForm();
        }
      });
  }

  getUserPhoto() {
    this.apiService
      .getUserInfo({ profile_photo_url: true })
      .subscribe((response: IUserAttributes) => {
        this.photoUrl = response.profile_photo_url;
      });
  }
  buildForm() {
    this.userInfoForm.patchValue({
      username: this.userInfo.username || '',
      email: this.userInfo.email || '',
      name: this.userInfo.name || '',
      city: this.userInfo.city || '',
      country: this.userInfo.country || '',
      description: this.userInfo.description || '',
    });
  }

  private updateUserInfo(value: IUserAttributes): void {
    this.userInfo = this.helperService.updateObjectWithNewValues(
      this.userInfo,
      value,
    );
  }

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.apiService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.photoUrl = response.url;
        this.imageService.setNewProfilePhotoUrl(response.url);
        this.showToastrMessage('success', response.message);
      },
      error: (error: failedUploadImageResponse) => {
        this.showToastrMessage('error', error.message);
      },
    });
  }

  onSubmit() {
    const filteredUserInfo = this.helperService.filterChangedPropertiesInObject(
      this.userInfoForm.value,
      this.userInfo,
    );
    this.apiService.updateUserInfo(filteredUserInfo).subscribe({
      next: (value: IUserUpdateResponse) => {
        this.updateUserInfo(value.response);
        this.buildForm();
        this.showToastrMessage('success', value.message);
      },
      error: (errorResponse: string) => {
        this.showToastrMessage('error', errorResponse);
      },
    });
  }

  ngOnInit() {
    this.getUserPhoto();
    this.getUserInfo();
  }
}

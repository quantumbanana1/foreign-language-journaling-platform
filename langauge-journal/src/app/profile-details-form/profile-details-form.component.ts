import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IUserAttributes } from '../types/User/userTypes';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-profile-details-form',
  standalone: true,
  imports: [],
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

  username = new FormControl(
    '',
    Validators.compose([Validators.minLength(5), Validators.maxLength(15)]),
  );

  email = new FormControl('', [Validators.email, Validators.required]);

  name = new FormControl(
    '',
    Validators.compose([
      Validators.minLength(2),
      Validators.maxLength(15),
      Validators.pattern(/^[1-9]\d*$/),
    ]),
  );

  constructor(
    formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit() {}

  onFileSelected(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.apiService.uploadProfileImage(file).subscribe();
  }
}

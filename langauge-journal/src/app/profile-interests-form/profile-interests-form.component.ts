import { Component, OnInit } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';
import { SelectInputComponent } from '../select-input/select-input.component';
import { ApiService } from '../api-service.service';
import { IInterest } from '../types/Response/getInterestsResponse';
import { SelectInterestsInputComponent } from '../select-interests-input/select-interests-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { toastrService } from '../toastr.service';

@Component({
  selector: 'app-profile-interests-form',
  standalone: true,
  imports: [
    SelectLanguagesInpuntComponent,
    SelectInputComponent,
    SelectInterestsInputComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './profile-interests-form.component.html',
  styleUrl: './profile-interests-form.component.scss',
})
export class ProfileInterestsFormComponent implements OnInit {
  public arrayOfInterests: IInterest[] = [];
  public interestForm!: FormGroup;
  public isLoading = false;
  private toastr: toastrService;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastrs: ToastrService,
  ) {
    this.toastr = new toastrService(this.toastrs);
  }

  // addInterestToList(interest: IInterest) {
  //   const isLanguageAdded = this.arrayOfInterests.find(
  //     (item) => item.name === this.arrayOfInterests.name,
  //   );
  //   if (!isLanguageAdded) {
  //     this.arrayOfInterests.push({
  //       name: this.selectedLanguage.name,
  //       language_id: this.selectedLanguage.language_id,
  //       proficiency: this.selectedLevel,
  //       type: 'language',
  //     });
  // }

  onSubmit() {
    console.log(this.interestForm.value.interest);
    this.isLoading = true;
    const request = {
      interest_id: this.interestForm.value.interest.interest_id,
      name: this.interestForm.value.interest.name,
    };
    this.apiService.uploadUserInterest(request).subscribe({
      next: (response) => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.showToastrMessage('error', error, 'Error');
      },
    });
  }

  public getUserInterests() {}

  ngOnInit() {
    this.interestForm = this.fb.group({
      interest: ['', Validators.required],
    });
  }
}

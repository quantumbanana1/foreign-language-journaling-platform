import { Component, OnInit } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';
import { SelectInputComponent } from '../select-input/select-input.component';
import { ApiService } from '../api-service.service';
import { IInterest } from '../types/Response/getInterestsResponse';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { toastrService } from '../toastr.service';
import { InterestService } from '../interest.service';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';

@Component({
  selector: 'app-profile-interests-form',
  standalone: true,
  imports: [
    SelectLanguagesInpuntComponent,
    SelectInputComponent,
    NgClass,
    BadgeButtonFromSelectionComponent,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-interests-form.component.html',
  styleUrl: './profile-interests-form.component.scss',
})
export class ProfileInterestsFormComponent implements OnInit {
  public interestForm!: FormGroup;
  public isLoading = false;
  private toastr: toastrService;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastrs: ToastrService,
    private interestService: InterestService,
  ) {
    this.toastr = new toastrService(this.toastrs);

    this.interestForm = this.fb.group({
      interest: ['', Validators.required],
    });
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
  selectedOptionRowState = false;
  selectedInterest: IInterest | null = null;
  arrayOfInterests: IInterest[] = [];
  userInterests: IInterest[] = [];

  onSubmit() {
    this.isLoading = true;
    const request: IInterest = {
      interest_id: this.interestForm.value.interest.interest_id,
      name: this.interestForm.value.interest.name,
      type: 'interest',
    };
    this.apiService.uploadUserInterest(request).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.userInterests.push(request);
          this.interestForm.reset();
          this.isLoading = false;
        }, 2500);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.showToastrMessage('error', error, 'Error');
      },
    });
  }

  //methods binded to selection option

  private getInterests() {
    return this.apiService.getInterests().subscribe((value) => {
      this.arrayOfInterests = value.data;
    });
  }

  private getUserInterests() {
    this.apiService.getUserInterests().subscribe({
      next: (response) => {
        this.userInterests = response.data.map((interest: IInterest) => ({
          ...interest,
          type: 'interest',
        }));
        if (this.userInterests.length > 0) {
          this.selectedOptionRowState = true;
        }
      },
    });
  }

  // private updateUserInterestList() {
  //   return this.interestService.notifyOfNewInterest.subscribe((value) => {
  //     this.userInterests.push(value);
  //   });
  // }

  private deleteInterest() {
    return this.interestService.notifyOfDeletion.subscribe((value) => {
      this.userInterests = this.userInterests.filter(
        (item) => item.name !== value.name,
      );
    });
  }

  selected() {}

  ngOnInit() {
    this.getInterests();
    this.getUserInterests();
    this.deleteInterest();
  }
}

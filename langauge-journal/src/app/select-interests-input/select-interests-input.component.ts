import { Component, OnInit } from '@angular/core';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { IInterest } from '../types/Response/getInterestsResponse';
import { ApiService } from '../api-service.service';
import { InterestService } from '../interest.service';

@Component({
  selector: 'app-select-interests-input',
  standalone: true,
  imports: [
    BadgeButtonFromSelectionComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './select-interests-input.component.html',
  styleUrl: './select-interests-input.component.scss',
})
export class SelectInterestsInputComponent implements OnInit {
  selectedOptionRowState: boolean;
  selectedInterest: IInterest;
  public arrayOfInterests: IInterest[] = [];
  public userInterests: IInterest[] = [];
  form!: FormGroup;

  constructor(
    private apiService: ApiService,
    private interestService: InterestService,
  ) {}

  private getInterests() {
    return this.apiService.getInterests().subscribe((value) => {
      this.arrayOfInterests = value.data;
    });
  }

  private getUserInterests() {
    this.apiService.getUserInterests().subscribe({
      next: (response) => {
        console.log(response);
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

  private updateUserInterestList() {
    return this.interestService.notifyOfNewInterest.subscribe((value) => {
      this.userInterests.push(value);
    });
  }

  private deleteInterest() {
    return this.interestService.notifyOfDeletion.subscribe((value) => {
      this.userInterests = this.userInterests.filter(
        (item) => item.name !== value.name,
      );
    });
  }

  selected() {
    console.log(this.selectedInterest);
  }

  ngOnInit() {
    this.getInterests();
    this.getUserInterests();
    this.updateUserInterestList();
    this.deleteInterest();
  }
}

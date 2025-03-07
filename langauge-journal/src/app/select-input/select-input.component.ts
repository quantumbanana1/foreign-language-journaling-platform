import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import { ApiService } from '../api-service.service';
import { IInterest } from '../types/Response/getInterestsResponse';
import { ReactiveFormsModule } from '@angular/forms';
import { BadgeButtonForNewPostComponent } from '../badge-button-for-new-post/badge-button-for-new-post.component';
import { InterestService } from '../interest.service';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [
    BadgeButtonFromSelectionComponent,
    CommonModule,
    ReactiveFormsModule,
    BadgeButtonForNewPostComponent,
  ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
})
export class SelectInputComponent implements OnInit {
  public selectedOptionRowState = false;
  public selectedInterests: IInterest[] = [];
  public arrayOfInterest: IInterest[] = [];
  isSelectActive: boolean = false;

  constructor(
    private apiService: ApiService,
    private interestService: InterestService,
  ) {}

  selected(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLSelectElement).value;
    const foundInterest = this.arrayOfInterest.find(
      (interest) => interest.interest_id.toString() === selectedOption,
    );

    if (!this.selectedInterests.includes(foundInterest)) {
      this.selectedInterests = [...this.selectedInterests, foundInterest];
      this.interestService.setNewInterestToList(foundInterest);
    }

    if (this.selectedInterests.length > 0) {
      this.selectedOptionRowState = true;
    }

    if (this.selectedInterests.length >= 5) {
      this.isSelectActive = true;
    }
  }

  getInterests() {
    return this.apiService.getInterests().subscribe((value) => {
      this.arrayOfInterest = value.data.map((interest) => ({
        ...interest,
        type: 'interest',
      }));
    });
  }

  getNotification(emittedData: IInterest[]) {
    console.log(emittedData);
    this.selectedInterests = emittedData;
    if (this.selectedInterests.length < 5) {
      this.isSelectActive = false;
    }
    console.log(this.isSelectActive);
  }

  ngOnInit() {
    this.getInterests();
  }
}

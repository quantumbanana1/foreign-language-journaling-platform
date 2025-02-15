import { Component, OnInit } from '@angular/core';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import {
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { IInterest } from '../types/Response/getInterestsResponse';
import { ApiService } from '../api-service.service';

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
  form!: FormGroup;

  constructor(
    private apiService: ApiService,
    private rootFormGroup: FormGroupDirective,
  ) {}

  private getInterests() {
    return this.apiService.getInterests().subscribe((value) => {
      this.arrayOfInterests = value.data;
    });
  }

  getUserInterests() {}

  selected() {
    console.log(this.selectedInterest);
  }

  ngOnInit() {
    this.form = this.rootFormGroup.control;
    this.getInterests();
  }
}

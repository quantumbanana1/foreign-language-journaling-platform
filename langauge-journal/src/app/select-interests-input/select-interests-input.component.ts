import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
export class SelectInterestsInputComponent {
  constructor() {}
}

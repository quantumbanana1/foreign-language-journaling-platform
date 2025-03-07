import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputPostBindingService } from '../input-post-binding.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import { SelectInputComponent } from '../select-input/select-input.component';
import { ApiService } from '../api-service.service';
import { IUserLanguage } from '../types/Language/langaugeResponse';
import { IInterest } from '../types/Response/getInterestsResponse';
import { InterestService } from '../interest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-selection-block-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeButtonFromSelectionComponent,
    SelectInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './selection-block-post.component.html',
  styleUrl: './selection-block-post.component.scss',
})
export class SelectionBlockPostComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  public userLanguages: IUserLanguage[];
  public withoutSelectedLanguages: boolean;
  private interestSubscription: Subscription;
  private interestDeletionSubscription: Subscription;

  constructor(
    private inputBindingsService: InputPostBindingService,
    private rootFormGroup: FormGroupDirective,
    private apiService: ApiService,
    private fb: FormBuilder,
    private interestService: InterestService,
  ) {}

  onChangeInput(eventTarget: EventTarget) {
    const val = (eventTarget as HTMLInputElement).value;
    this.inputBindingsService.updateValue(val);
  }

  selected(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLSelectElement).value;
    const selectedLanguage = this.userLanguages.find(
      (language) => language.language_id.toString() === selectedOption,
    );

    this.notifyParent.emit(selectedLanguage.name);
  }

  getUserLanguages() {
    return this.apiService.getUserLanguages().subscribe((value) => {
      this.userLanguages = value.data;
      this.withoutSelectedLanguages = !(this.userLanguages.length > 0);
    });
  }

  private subscribeToNewInterestNotify() {
    this.interestSubscription =
      this.interestService.notifyOfNewInterest.subscribe((interest) => {
        this.addInterestToFormArray(interest);
      });
  }

  private subscribeToDeletetionInterest() {
    this.interestDeletionSubscription =
      this.interestService.notifyOfDeletion.subscribe((interest) => {
        this.removeInterestFromFromArray(interest);
      });
  }

  private addInterestToFormArray(interest: IInterest) {
    if (this.isInterestValid(interest)) {
      const controlInterest = this.fb.control(interest);
      this.formInterest.push(controlInterest);
    }
  }

  private removeInterestFromFromArray(interest: IInterest) {
    if (this.isInterestValid(interest)) {
      console.log(this.formInterest.controls);
      const index = this.formInterest.controls.findIndex(
        (control) => control.value.interest_id === interest.interest_id,
      );
      this.formInterest.removeAt(index);
    }

    console.log(this.formInterest);
  }

  private isInterestValid(interest: IInterest): boolean {
    return interest && interest.interest_id !== null && interest.name !== null;
  }

  private get formInterest() {
    return this.form.controls['interests'] as FormArray;
  }

  ngOnInit() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.getUserLanguages();
    this.subscribeToNewInterestNotify();
    this.subscribeToDeletetionInterest();
  }

  ngOnDestroy() {
    if (this.interestSubscription) {
      this.interestSubscription.unsubscribe();
    }

    if (this.interestDeletionSubscription) {
      this.interestDeletionSubscription.unsubscribe();
    }
  }
}

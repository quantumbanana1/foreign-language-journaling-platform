import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgForOf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { InputPostBindingService } from '../input-post-binding.service';
import { IChooseLanguageWithLevel } from '../types/Language/languageOptionTypes';
import { ApiService } from '../api-service.service';
import { IInterest } from '../types/Response/getInterestsResponse';
import { HelperService } from '../helper.service';
import { InterestService } from '../interest.service';

type arrayOfInterest = Array<IChooseLanguageWithLevel | IInterest>;

@Component({
  selector: 'app-badge-button-from-selection',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './badge-button-from-selection.component.html',
  styleUrl: './badge-button-from-selection.component.scss',
})
export class BadgeButtonFromSelectionComponent implements OnInit, OnChanges {
  public arrayInterests: string[] = [];
  @Input() selectedInterest: arrayOfInterest;
  @Output() notifyParent: EventEmitter<IChooseLanguageWithLevel[]> =
    new EventEmitter();

  constructor(
    private inputBindingsService: InputPostBindingService,
    private apiService: ApiService,
    private helperService: HelperService,
    private interestService: InterestService,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedInterest[0].type === 'language') {
      const ArrayOfKeys = this.selectedInterest.map(
        (object: IChooseLanguageWithLevel | IInterest) => object.name,
      );
      this.arrayInterests = ArrayOfKeys;
      this.inputBindingsService.updateValueInterests(ArrayOfKeys);
    }
  }

  removeBadge(event: Event) {
    event.preventDefault();
    const id = (event.currentTarget as HTMLButtonElement).id;
    // const removeIndex = this.selectedInterest
    //   .map((item) => item.name)
    //   .indexOf(id);
    // const itemToDelete = this.selectedInterest[removeIndex];
    const itemToDelete = this.helperService.removeItemFromArray(
      this.selectedInterest,
      id,
    );
    if (this.isLanguage(itemToDelete)) {
      this.apiService.deleteLanguage(itemToDelete).subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    if (this.isInterest(itemToDelete)) {
      this.apiService.deleteUserInterest(itemToDelete.interest_id).subscribe({
        next: (value) => {
          this.interestService.deleteInterest(itemToDelete);
        },
      });
    }
  }

  private isLanguage(item: any): item is IChooseLanguageWithLevel {
    return item && item.type === 'language';
  }

  private isInterest(item: any): item is IInterest {
    return item && item.type === 'interest';
  }
}

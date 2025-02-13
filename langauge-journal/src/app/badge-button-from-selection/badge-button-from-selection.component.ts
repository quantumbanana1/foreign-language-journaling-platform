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

@Component({
  selector: 'app-badge-button-from-selection',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './badge-button-from-selection.component.html',
  styleUrl: './badge-button-from-selection.component.scss',
})
export class BadgeButtonFromSelectionComponent implements OnInit, OnChanges {
  public interestName: string = '';
  public arrayInterests: string[] = [];
  @Input() selectedInterest: IChooseLanguageWithLevel[];
  @Output() notifyParent: EventEmitter<IChooseLanguageWithLevel[]> =
    new EventEmitter();

  constructor(private inputBindingsService: InputPostBindingService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedInterest[0].type === 'language') {
      const ArrayOfKeys = this.selectedInterest.map(
        (object: IChooseLanguageWithLevel) => object.name,
      );
      this.arrayInterests = ArrayOfKeys;
      this.inputBindingsService.updateValueInterests(ArrayOfKeys);
    }
  }

  removeBadge(event: Event) {
    event.preventDefault();
    const id = (event.currentTarget as HTMLButtonElement).id;
    const removeIndex = this.selectedInterest
      .map((item) => item.name)
      .indexOf(id);
    const itemToDelete = this.selectedInterest[removeIndex];
    removeIndex >= 0 && this.selectedInterest.splice(removeIndex, 1);
    this.notifyParent.emit(this.selectedInterest);
  }

  protected readonly Object = Object;
}

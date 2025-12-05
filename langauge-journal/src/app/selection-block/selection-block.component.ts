import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SelectedItemComponent } from '../selected-item/selected-item.component';
import { ApiService } from '../api-service.service';
import {
  ILanguageResponse,
  ILanguage,
} from '../types/Language/langaugeResponse';
import { response } from 'express';
import { SelectionHelperService } from '../selection-helper.service';

@Component({
  selector: 'app-selection-block',
  standalone: true,
  imports: [SelectedItemComponent],
  templateUrl: './selection-block.component.html',
  styleUrl: './selection-block.component.scss',
})
export class SelectionBlockComponent<T> {
  @Input() items!: T[];
  @Input() trackKey!: keyof T;
  @Input() typeOfItem!: string;
  selectedItems: T[] = [];

  selected(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLSelectElement).value;
    console.log(selectedOption);
    let selectedItem: T;

    if (this.typeOfItem === 'language') {
      selectedItem = this.items.find(
        (language: T) => language['language_id'].toString() === selectedOption,
      );
    }

    if (this.typeOfItem === 'interest') {
      selectedItem = this.items.find(
        (language: T) => language['interest_id'].toString() === selectedOption,
      );
    }

    if (selectedItem) {
      this.selectedItems.push(selectedItem);
    } else {
      return null;
    }
  }

  constructor(public selectionHelperService: SelectionHelperService<T>) {}
}

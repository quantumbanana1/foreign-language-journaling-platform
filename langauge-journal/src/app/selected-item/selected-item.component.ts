import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionHelperService } from '../selection-helper.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-selected-item',
  standalone: true,
  imports: [],
  templateUrl: './selected-item.component.html',
  styleUrl: './selected-item.component.scss',
})
export class SelectedItemComponent<T> {
  @Input() selectedItems!: T[];
  @Input() trackKey!: keyof T;
  @Input() typeOfItem!: string;
  @Output() remove = new EventEmitter<{
    selectedItem: T;
    action: 'removing';
  }>();

  constructor(
    public selectionHelperService: SelectionHelperService<T>,
    private helperService: HelperService,
  ) {}

  removeBadge(event: Event) {
    event.preventDefault();
    const id = (event.currentTarget as HTMLButtonElement).value;

    let itemToDelete: T;

    if (this.typeOfItem === 'language') {
      itemToDelete = this.helperService.removeItemFromArrayById(
        this.selectedItems,
        id,
        'language_id',
      );
    }

    if (this.typeOfItem === 'interest') {
      itemToDelete = this.helperService.removeItemFromArrayById(
        this.selectedItems,
        id,
        'interest_id',
      );
    }

    this.remove.emit({ selectedItem: itemToDelete, action: 'removing' });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [BadgeButtonFromSelectionComponent, CommonModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
})
export class SelectInputComponent {
  public selectedOptionRowState = false;
  public selectedInterests: string[] = [];

  constructor() {}

  selected(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLInputElement).value;
    if (!this.selectedInterests.includes(selectedOption)) {
      this.selectedInterests = [...this.selectedInterests, selectedOption];
    }

    if (this.selectedInterests.length > 0) {
      this.selectedOptionRowState = true;
    }
  }

  getNotification(emittedData: any[]) {
    if (this.selectedInterests !== emittedData) {
      this.selectedInterests = emittedData;
    }
  }
}

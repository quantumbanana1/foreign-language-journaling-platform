import { Component } from '@angular/core';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-select-languages-inpunt',
  standalone: true,
  imports: [BadgeButtonFromSelectionComponent, NgIf],
  templateUrl: './select-languages-inpunt.component.html',
  styleUrl: './select-languages-inpunt.component.scss',
})
export class SelectLanguagesInpuntComponent {
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

  getNotification(emittedData: string[]) {
    if (this.selectedInterests !== emittedData) {
      this.selectedInterests = emittedData;
    }
  }
}

import { Component } from '@angular/core';
import { SelectInputComponent } from '../select-input/select-input.component';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [SelectInputComponent],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent {
  private selectedOption: string;

  selected(eventTarget: EventTarget) {
    this.selectedOption = (eventTarget as HTMLInputElement).value;
  }
}

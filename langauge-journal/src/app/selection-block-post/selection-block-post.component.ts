import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {InputPostBindingService} from "../input-post-binding.service";
import {FormsModule} from "@angular/forms";
import {BadgeButtonFromSelectionComponent} from "../badge-button-from-selection/badge-button-from-selection.component";
import {SelectInputComponent} from "../select-input/select-input.component";

@Component({
  selector: 'app-selection-block-post',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeButtonFromSelectionComponent, SelectInputComponent],
  templateUrl: './selection-block-post.component.html',
  styleUrl: './selection-block-post.component.scss'
})
export class SelectionBlockPostComponent  {

  public selectedInterests: string[] = []
  public titleValue: string = '';

  constructor(private inputBindingsService: InputPostBindingService) { }


  onChangeInput(eventTarget: EventTarget) {
    const val = (eventTarget as HTMLInputElement).value;
    this.inputBindingsService.updateValue(val);

  }


}

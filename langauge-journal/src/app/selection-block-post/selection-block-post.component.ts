import {Component, EventEmitter, Output} from '@angular/core';
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
  public languageValue:string = ''
  @Output() notifyParent : EventEmitter<any> = new EventEmitter();

  constructor(private inputBindingsService: InputPostBindingService) { }


  onChangeInput(eventTarget: EventTarget) {
    const val = (eventTarget as HTMLInputElement).value;
    this.inputBindingsService.updateValue(val);

  }


  selected(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLSelectElement).value
    console.log(selectedOption)


    if (this.languageValue !== selectedOption) {
      this.languageValue = selectedOption;
      this.notifyParent.emit(this.languageValue)
    }


  }
}

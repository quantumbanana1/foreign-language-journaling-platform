import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgForOf} from "@angular/common";
import { EventEmitter } from '@angular/core';
import {InputPostBindingService} from "../input-post-binding.service";

@Component({
  selector: 'app-badge-button-from-selection',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './badge-button-from-selection.component.html',
  styleUrl: './badge-button-from-selection.component.scss'
})
export class BadgeButtonFromSelectionComponent implements OnInit, OnChanges {

  public interestName: string = '';
  public arrayInterests: string[] = [];
  @Input() selectedInterest: string[];
  @Output() notifyParent : EventEmitter<any> = new EventEmitter();


  constructor(private inputBindingsService: InputPostBindingService) {
  }


  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.inputBindingsService.updateValueInterests(this.selectedInterest)

  }

  removeBadge(event: Event) {
    event.preventDefault()
    const id = (event.currentTarget as HTMLButtonElement).id
    this.selectedInterest = this.selectedInterest.filter((interest) => interest !== id)
    this.notifyParent.emit(this.selectedInterest);


  }
}

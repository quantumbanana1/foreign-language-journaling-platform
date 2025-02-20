import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgForOf } from '@angular/common';
import { InputPostBindingService } from '../input-post-binding.service';
import { ApiService } from '../api-service.service';
import { HelperService } from '../helper.service';
import { InterestService } from '../interest.service';
import { IInterest } from '../types/Response/getInterestsResponse';

@Component({
  selector: 'app-badge-button-for-new-post',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './badge-button-for-new-post.component.html',
  styleUrl: './badge-button-for-new-post.component.scss',
})
export class BadgeButtonForNewPostComponent implements OnInit, OnChanges {
  public arrayInterests: string[] = [];
  @Input() selectedInterest: IInterest[];
  @Output() notifyParent: EventEmitter<IInterest[]> = new EventEmitter();

  constructor(
    private inputBindingsService: InputPostBindingService,
    private apiService: ApiService,
    private helperService: HelperService,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedInterest[0].type === 'interest') {
      this.updateIndicatorInterest();
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

    if (this.isInterest(itemToDelete)) {
      // this.interestService.deleteInterest(itemToDelete);
      this.notifyParent.emit(this.selectedInterest);
      this.updateIndicatorInterest();
    }
  }

  private isInterest(item: any): item is IInterest {
    return item && item.type === 'interest';
  }

  private updateIndicatorInterest() {
    const ArrayOfKeys = this.helperService.getPropertyFromArray(
      this.selectedInterest,
      'name',
    );
    this.inputBindingsService.updateValueInterests(ArrayOfKeys);
  }
}

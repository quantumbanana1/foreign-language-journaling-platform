import { Component } from '@angular/core';
import { InputPostBindingService } from '../input-post-binding.service';
import { CommonModule } from '@angular/common';

interface onInit {}

@Component({
  selector: 'app-interests-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interests-indicator.component.html',
  styleUrl: './interests-indicator.component.scss',
})
export class InterestsIndicatorComponent implements onInit {
  public arrayInterests: string[] = [];

  constructor(private inputBindingsService: InputPostBindingService) {}

  ngOnInit() {
    this.submitInterests();
  }

  submitInterests() {
    this.inputBindingsService.inputDataInterests.subscribe((data) => {
      this.arrayInterests = data;
    });
  }
}

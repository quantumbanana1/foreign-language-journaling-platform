import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { IInterest } from '../types/Response/getInterestsResponse';

@Component({
  selector: 'app-interest-indicator-static',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './interest-indicator-static.component.html',
  styleUrl: './interest-indicator-static.component.scss',
})
export class InterestIndicatorStaticComponent {
  @Input() arrayOfInterests!: IInterest[];
}

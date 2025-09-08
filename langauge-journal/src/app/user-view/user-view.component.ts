import { Component } from '@angular/core';
import { LngLevelComponent } from '../lng-level/lng-level.component';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [LngLevelComponent],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent {}

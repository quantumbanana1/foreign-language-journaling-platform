import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar-profile.component.html',
  styleUrl: './side-bar-profile.component.scss',
})
export class SideBarProfileComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {});
  }
}

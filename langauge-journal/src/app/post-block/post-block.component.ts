import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-block',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post-block.component.html',
  styleUrl: './post-block.component.scss',
})
export class PostBlockComponent {
  constructor(private router: Router) {}

  navigateToPost($event: MouseEvent) {
    this.router.navigateByUrl('post/13');
  }
}

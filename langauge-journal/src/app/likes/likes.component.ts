import { Component } from '@angular/core';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss',
})
export class LikesComponent {
  postComments: string;
  postLikes: string;
}

import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../api-service.service';

interface IPostFeed {}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet, NgIf],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  constructor(private apiService: ApiService) {}

  public username: string = '';
  public fetchedPosts: IPostFeed = {};
}

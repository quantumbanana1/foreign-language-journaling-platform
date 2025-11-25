import { Component, OnDestroy, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../api-service.service';
import {
  IGetAllPostsResponse,
  IPostObject,
  PostResponse,
} from '../types/Response/postTypes';
import { Subject, takeUntil } from 'rxjs';
import { response } from 'express';
import { FeedPostComponent } from '../feed-post/feed-post.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [SideBarComponent, RouterOutlet, NgIf, FeedPostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnDestroy, OnInit {
  constructor(private apiService: ApiService) {}

  private destroy$ = new Subject<void>();

  public username: string = '';
  public fetchedPosts: IPostObject[];

  private getAllPosts() {
    this.apiService
      .getAllPost()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetAllPostsResponse) => {
          this.fetchedPosts = response.data;
          console.log(this.fetchedPosts);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

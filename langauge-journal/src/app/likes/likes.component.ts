import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FollowingStatus } from '../types/followingStatus/followinStatus';
import { ApiService } from '../api-service.service';
import { IPostObject } from '../types/Response/postTypes';
import { ILikePostResponse } from '../types/Response/FollowingResponses';
import { response } from 'express';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [NgIf],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss',
})
export class LikesComponent implements OnInit {
  @Input() postInfo!: IPostObject;
  postComments: string;
  postLikes: string;
  isPostLiked: boolean = false;

  public readonly likeStatus: WritableSignal<{ isLiked: boolean }> = signal<{
    isLiked: boolean;
  }>({
    isLiked: false,
  });

  constructor(private apiService: ApiService) {}

  handleLikeClick() {
    if (!this.isPostLiked) {
      this.apiService.likePost(this.postInfo.post_id).subscribe({
        next: (response) => {
          console.log(response);
          this.isPostLiked = response.data.isLiked;
          this.likeStatus.set({ isLiked: true });
        },

        error: () => {},
      });
    } else {
    }
  }

  ngOnInit(): void {
    this.isPostLiked = this.postInfo.is_liked;
    this.likeStatus.set({ isLiked: this.isPostLiked });
    console.log(this.isPostLiked);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostViewComponent } from '../post-view/post-view.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { UserViewComponent } from '../user-view/user-view.component';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ApiService } from '../api-service.service';
import { IPostObject } from '../types/Response/postTypes';

@Component({
  selector: 'app-user-post',
  standalone: true,
  imports: [
    PostViewComponent,
    PostCommentsComponent,
    UserViewComponent,
    PopUpComponent,
  ],
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.scss',
})
export class UserPostComponent implements OnInit {
  postId: string;

  public postInfo: IPostObject;
  public postDate: Date;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  private getPost() {
    console.log(this.postId);
    this.apiService.getPost(Number(this.postId)).subscribe({
      next: (response) => {
        this.postInfo = response.data;
        this.postDate = new Date(this.postInfo.time_created);
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.getPost();
  }
}

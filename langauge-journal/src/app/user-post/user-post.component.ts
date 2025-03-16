import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostViewComponent } from '../post-view/post-view.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { UserViewComponent } from '../user-view/user-view.component';

@Component({
  selector: 'app-user-post',
  standalone: true,
  imports: [PostViewComponent, PostCommentsComponent, UserViewComponent],
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.scss',
})
export class UserPostComponent implements OnInit {
  postId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    console.log(this.postId);
  }
}

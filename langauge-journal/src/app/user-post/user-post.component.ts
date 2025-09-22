import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostViewComponent } from '../post-view/post-view.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { UserViewComponent } from '../user-view/user-view.component';
import { PopUpComponent } from '../pop-up/pop-up.component';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { IPostObject, IUserPost } from '../types/Response/postTypes';
import { Router } from '@angular/router';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-published-posts',
  standalone: true,
  imports: [],
  templateUrl: './published-posts.component.html',
  styleUrl: './published-posts.component.scss',
})
export class PublishedPostsComponent implements OnInit {
  public date: string;
  constructor(
    private router: Router,
    private helper: HelperService,
  ) {}
  @Input() post!: IUserPost;
  public postContent: string;
  public estimatedTimeToRead: number;

  goToPost(post_id: number) {
    this.router.navigate(['/post', post_id]);
  }

  ngOnInit(): void {
    this.postContent = this.helper.sterylizeHTMLtoGetContent(
      this.post.post_content,
    );
    this.estimatedTimeToRead = this.helper.estimateReadingTime(
      this.postContent,
    );

    this.date = this.helper.formatDate(this.post.time_created);
  }
}

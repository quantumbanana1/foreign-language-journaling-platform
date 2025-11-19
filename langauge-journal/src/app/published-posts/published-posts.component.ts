import { Component, Input, OnInit } from '@angular/core';
import { IUserPost } from '../types/Response/postTypes';
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
  constructor(
    private router: Router,
    private helper: HelperService,
  ) {}
  @Input() post!: IUserPost;
  public postContent: string;

  goToPost(post_id: number) {
    this.router.navigate(['/post', post_id]);
  }

  private sterylizeHTMLtoGetContent(postContent: string) {
    let container = '';
    let startAddingTextToContainer = false;
    const str = '>one</ >two</ >three</';
    const matches = [...postContent.matchAll(/>([^<]+)</g)].map((m) => m[1]);
    let text: string = '';

    matches.forEach((string, index) => {
      text += string;
      if (index !== matches.length - 1) {
        text += ' ';
      }
    });
    console.log(text);
    return text;
  }

  ngOnInit(): void {
    this.postContent = this.sterylizeHTMLtoGetContent(this.post.post_content);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { IPostObject } from '../types/Response/postTypes';
import { HelperService } from '../helper.service';
import { LevelLanguage } from '../types/Language/languageOptionTypes';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed-post',
  standalone: true,
  imports: [NgClass],
  templateUrl: './feed-post.component.html',
  styleUrl: './feed-post.component.scss',
})
export class FeedPostComponent implements OnInit {
  @Input() post!: IPostObject;
  public postContent: string;
  public estimatedTimeToRead: number;
  public dateOfPublished: string;

  constructor(
    private helperService: HelperService,
    private router: Router,
  ) {}

  goToPost(post_id: number) {
    this.router.navigate(['/post', post_id]);
  }

  public shouldStop(index: number) {
    switch (this.post.language_object.proficiency) {
      case LevelLanguage.Beginner:
        return index >= 1;

      case LevelLanguage.Intermediate:
        return index >= 2;

      case LevelLanguage.Advanced:
        return index >= 3;

      case LevelLanguage.Native:
        return false;

      default:
        return index >= 1;
    }
  }

  ngOnInit(): void {
    this.postContent = this.helperService.sterylizeHTMLtoGetContent(
      this.post.post_content,
    );
    this.estimatedTimeToRead = this.helperService.estimateReadingTime(
      this.postContent,
    );

    this.dateOfPublished = this.helperService.formatDate(
      this.post.time_created,
    );
  }
}

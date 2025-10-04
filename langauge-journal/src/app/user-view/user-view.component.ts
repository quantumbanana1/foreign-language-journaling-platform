import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LngLevelComponent } from '../lng-level/lng-level.component';
import { ApiService } from '../api-service.service';
import { IPostObject } from '../types/Response/postTypes';
import { Subject, takeUntil } from 'rxjs';
import {
  IChooseLanguageWithLevel,
  IResponseUserLanguages,
} from '../types/Language/languageOptionTypes';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [LngLevelComponent, NgOptimizedImage],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private apiService: ApiService) {}

  @Input() postId!: string;
  @Input() postInfo!: IPostObject;

  public languages: IChooseLanguageWithLevel[];

  private destroy$ = new Subject<void>();

  getUserLanguages() {
    console.log('czy to kurwaaa działa/?????');
    console.log(this.postInfo.user_id);
    this.apiService
      .getUserLanguagesById(Number(this.postInfo.user_id))
      .pipe()
      .subscribe({
        next: (response: IResponseUserLanguages) => {
          console.log('response from server: ', response);
          this.languages = response.data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.getUserLanguages();
  }
}

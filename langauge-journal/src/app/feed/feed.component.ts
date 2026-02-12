import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../api-service.service';
import {
  IGetAllPostsResponse,
  IPostObject,
  ISearchResponse,
  IUserPost,
  PostResponse,
} from '../types/Response/postTypes';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  elementAt,
  fromEvent,
  map,
  Observable,
  of,
  pairwise,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FeedPostComponent } from '../feed-post/feed-post.component';
import {
  ILanguage,
  ILanguageResponse,
} from '../types/Language/langaugeResponse';
import { SelectionBlockComponent } from '../selection-block/selection-block.component';
import {
  IGetInterestsResponse,
  IInterest,
} from '../types/Response/getInterestsResponse';
import { toObservable } from '@angular/core/rxjs-interop';
import { PostSearchParams } from '../types/apiTypes';
import { SelectedItemEvent } from '../my-posts/my-posts.component';

export interface singalForBoxToggle {
  value: boolean;
  action: string;
}

export interface SearchFilters {
  followedAuthors: boolean;
  needsFeedback: boolean;
  savedPosts: boolean;
  commentedPosts: boolean;
  myLanguages: boolean;
  clearFilters: boolean;
  status: string;
  languages: ILanguage[];
  interests: IInterest[];
  mine: boolean;
}

export interface ISignalCurrentPostsState {
  currentPosts: IPostObject[];
}

export type SearchStreamResponse = {
  data: IPostObject[] | [];
  revertToFetchedPosts: boolean;
};

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    SideBarComponent,
    RouterOutlet,
    NgIf,
    FeedPostComponent,
    SelectionBlockComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnDestroy, OnInit, AfterViewInit {
  constructor(private apiService: ApiService) {}

  private destroy$ = new Subject<void>();

  @ViewChild('searchBox', { static: false })
  searchBox!: ElementRef<HTMLInputElement>;
  keyup$!: Subscription;
  public username: string = '';
  public fetchedPosts: IPostObject[];
  public languages: ILanguage[];
  interests: IInterest[];

  private readonly error: WritableSignal<string> = signal<string | null>(null);
  errorMessage: WritableSignal<string> = this.error;

  private readonly toggleSearchAdvancedBox = signal<singalForBoxToggle>({
    value: false,
    action: 'Show',
  });
  advancedBox: WritableSignal<singalForBoxToggle> =
    this.toggleSearchAdvancedBox;

  private readonly filtersStatus: WritableSignal<SearchFilters> =
    signal<SearchFilters>({
      followedAuthors: false,
      needsFeedback: false,
      savedPosts: false,
      commentedPosts: false,
      myLanguages: false,
      clearFilters: false,
      status: 'published',
      languages: [],
      interests: [],
      mine: false,
    });
  filters: WritableSignal<SearchFilters> = this.filtersStatus;
  private filters$: Observable<SearchFilters> = toObservable(this.filters);

  private readonly currentPostsState = signal<ISignalCurrentPostsState>({
    currentPosts: [],
  });
  currentPostsSignal = this.currentPostsState;

  private search$: Subject<string> = new Subject<string>();

  private readonly query$ = this.search$.pipe(
    map((v) => v ?? ''),
    map((v) => v.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    startWith(''),
  );

  private getAllPosts() {
    this.apiService
      .getAllPost()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetAllPostsResponse) => {
          this.fetchedPosts = response.data;
          this.currentPostsState.set({ currentPosts: response.data });
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  getLanguages() {
    this.apiService
      .getAllLanguages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ILanguageResponse) => {
          this.languages = response.data;
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  getInterests() {
    this.apiService
      .getInterests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetInterestsResponse) => {
          this.interests = response.data;
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  toggleAdvancedSearchBox() {
    this.toggleSearchAdvancedBox.update((current) => ({
      value: !current.value,
      action: !current.value ? 'Close' : 'Show',
    }));
  }

  private setFiltersToDefaultState() {
    this.filters.update((current) => ({
      followedAuthors: false,
      needsFeedback: false,
      savedPosts: false,
      commentedPosts: false,
      myLanguages: false,
      clearFilters: false,
      status: 'published',
      languages: [],
      interests: [],
      mine: false,
    }));
  }

  toggleFiltersStatus(k: keyof SearchFilters) {
    this.filters.update((current) => ({
      ...current,
      [k]: !current[k],
    }));

    if (this.filters().clearFilters) {
      this.setFiltersToDefaultState();
      // this.currentPostsSignal.set({ currentPosts: this.fetchedPosts });
    }
  }

  onSearch(element: EventTarget) {
    const value = (element as HTMLInputElement).value;
    this.search$.next(value);
  }

  createStreamForSearchPosts() {
    combineLatest([this.query$, this.filters$])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([query, filters]) => {
          const isFalse = this.isAllFalse(filters);
          console.log('query', query);

          if (isFalse && query.trim() === '') {
            const streamResponse: SearchStreamResponse = {
              data: [],
              revertToFetchedPosts: true,
            };

            return of(streamResponse);
          }

          return this.apiService.searchPosts(query, filters).pipe(
            map(
              (response: ISearchResponse): SearchStreamResponse => ({
                ...response,
                data: response.data ?? [],
                revertToFetchedPosts: false,
              }),
            ),

            catchError((err) => {
              this.error.set(err);
              const response: SearchStreamResponse = {
                data: [],
                revertToFetchedPosts: false,
              };
              return of(response);
            }),
          );
        }),
      )
      .subscribe((response) => {
        if (!response.revertToFetchedPosts) {
          this.currentPostsSignal.set({ currentPosts: response.data });
        } else {
          this.currentPostsSignal.set({ currentPosts: this.fetchedPosts });
        }
      });
  }

  isAllFalse(object: any): boolean {
    return Object.values(object).every((v) => !v);
  }

  ngOnInit(): void {
    this.getAllPosts();
    this.getLanguages();
    this.getInterests();
    this.createStreamForSearchPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {}

  selectedItemsChange<T>($event: SelectedItemEvent) {
    if ($event.selectedItem['language_id']) {
      const exists = this.filters().languages.some(
        (l: ILanguage) => l.language_id === $event.selectedItem['language_id'],
      );

      if (!exists && $event.action === 'adding') {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            languages: [...current.languages, $event.selectedItem as ILanguage],
          };
        });
      } else if (exists && $event.action === 'removing') {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            languages: current.languages.filter(
              (l) => l.language_id !== $event.selectedItem['language_id'],
            ),
          };
        });
      }
    }

    if ($event.selectedItem['interest_id']) {
      const exists = this.filters().interests.some(
        (i) => i.interest_id === $event['interest_id'],
      );

      if (!exists && $event.action === 'adding') {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            interests: [...current.interests, $event.selectedItem as IInterest],
          };
        });
      } else if (exists && $event.action === 'removing') {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            interests: current.interests.filter(
              (i) => i.interest_id !== $event.selectedItem['interest_id'],
            ),
          };
        });
      }
    }
  }
}

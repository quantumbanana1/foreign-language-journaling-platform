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
  PostResponse,
} from '../types/Response/postTypes';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  pairwise,
  Subject,
  Subscription,
  takeUntil,
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

interface singalForBoxToggle {
  value: boolean;
  action: string;
}

interface SearchFilters {
  followedAuthors: boolean;
  needsFeedback: boolean;
  savedPosts: boolean;
  commentedPosts: boolean;
  myLanguages: boolean;
  clearFilters: boolean;
}

interface ISignalCurrentPostsState {
  currentPosts: IPostObject[];
}

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
    });
  filters: WritableSignal<SearchFilters> = this.filtersStatus;
  private lastQuery: string = '';
  private filters$: Observable<SearchFilters> = toObservable(this.filters);

  private readonly currentPostsState = signal<ISignalCurrentPostsState>({
    currentPosts: [],
  });
  currentPostsSignal = this.currentPostsState;

  private search$: Subject<string> = new Subject<string>();

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
    }));
  }

  toggleFiltersStatus(k: keyof SearchFilters) {
    this.filters.update((current) => ({
      ...current,
      [k]: !current[k],
    }));

    if (this.filters().clearFilters) {
      this.setFiltersToDefaultState();
      this.currentPostsSignal.set({ currentPosts: this.fetchedPosts });
    }
  }

  onSearch(element: EventTarget) {
    const value = (element as HTMLInputElement).value;
    this.lastQuery = value;
    this.search$.next(value);
  }

  SearchPosts(value: string) {
    this.apiService
      .searchPosts(
        value,
        this.filtersStatus().followedAuthors,
        this.filtersStatus().needsFeedback,
        this.filtersStatus().myLanguages,
        this.filtersStatus().commentedPosts,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data.length > 0) {
            this.currentPostsSignal.set({ currentPosts: response.data });
          } else {
            this.currentPostsSignal.set({ currentPosts: this.fetchedPosts });
          }
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  createKeyUpEvent() {
    this.search$
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((v: string) => this.SearchPosts(v));
  }

  subscribeToChangeFilterStates() {
    this.filters$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.SearchPosts(this.lastQuery);
    });
  }

  isAllFalse(object: any): boolean {
    return Object.values(object).every((v) => !v);
  }

  ngOnInit(): void {
    this.getAllPosts();
    this.getLanguages();
    this.getInterests();
    this.createKeyUpEvent();
    this.subscribeToChangeFilterStates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {}
}

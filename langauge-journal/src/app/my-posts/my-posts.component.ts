import {
  Component,
  effect,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { PostBlockComponent } from '../post-block/post-block.component';
import { FiltersBlockComponent } from '../filters-block/filters-block.component';
import { RouterLink } from '@angular/router';
import { PublishedPostsComponent } from '../published-posts/published-posts.component';
import { ApiService } from '../api-service.service';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  IGetUserPostsResponse,
  IPostObject,
  ISearchResponse,
  IUserPost,
} from '../types/Response/postTypes';
import { IUserAttributesResponse } from '../types/User/userTypes';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  SearchFilters,
  SearchStreamResponse,
  singalForBoxToggle,
} from '../feed/feed.component';
import { SelectionBlockComponent } from '../selection-block/selection-block.component';
import { NgIf } from '@angular/common';
import { ILanguage } from '../types/Language/langaugeResponse';
import {
  IGetInterestsResponse,
  IInterest,
} from '../types/Response/getInterestsResponse';
import { FeedPostComponent } from '../feed-post/feed-post.component';
import { IResponseUserLanguages } from '../types/Language/languageOptionTypes';
import { LanguageTableService } from '../language-table.service';
import { HelperService } from '../helper.service';

interface activeToggleButtons {
  published: boolean;
  private: boolean;
  draft: boolean;
}

interface IactiveButtonClass {
  published: string;
  private: string;
  draft: string;
}

interface IEffClassName {
  eff1: boolean;
  eff2: boolean;
  eff3: boolean;
}

function isActiveClass(element: any): element is activeToggleButtons {
  return (
    typeof element.published === 'boolean' &&
    typeof element.private === 'boolean' &&
    typeof element.draft === 'boolean'
  );
}

interface ISignalCurrentPostsState {
  currentPosts: IUserPost[];
}

type SelectedItemEvent =
  | { selectedItem: ILanguage; action: string }
  | { selectedItem: IInterest; action: string };

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [
    PostBlockComponent,
    FiltersBlockComponent,
    RouterLink,
    PublishedPostsComponent,
    SelectionBlockComponent,
    NgIf,
    FeedPostComponent,
  ],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss',
})
export class MyPostsComponent implements OnInit, OnDestroy {
  @ViewChild('ContainerButtons') ContainerButtons: ElementRef;
  @ViewChild('activeBttn') activeBttn: ElementRef;
  $destroySubscription = new Subject<void>();

  @ViewChild('searchBox', { static: false })
  searchBox!: ElementRef<HTMLInputElement>;

  public fetchedPosts: IUserPost[];
  public languages: ILanguage[];
  interests: IInterest[];

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
    });
  filters: WritableSignal<SearchFilters> = this.filtersStatus;
  private filters$: Observable<SearchFilters> = toObservable(this.filters);

  private readonly currentPostsState = signal<ISignalCurrentPostsState>({
    currentPosts: [],
  });
  currentPostsSignal = this.currentPostsState;

  private search$: Subject<string> = new Subject<string>();

  private readonly toggleSearchAdvancedBox = signal<singalForBoxToggle>({
    value: false,
    action: 'Show',
  });
  advancedBox: WritableSignal<singalForBoxToggle> =
    this.toggleSearchAdvancedBox;

  private readonly query$ = this.search$.pipe(
    map((v) => v ?? ''),
    map((v) => v.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    startWith(''),
  );

  private readonly error: WritableSignal<string> = signal<string | null>(null);
  errorMessage: WritableSignal<string> = this.error;

  constructor(
    private apiService: ApiService,
    public serviceLangT: LanguageTableService,
    private hs: HelperService,
  ) {
    effect(() => {
      const selected = this.serviceLangT.selected();
      console.log('Zmiana języków:', selected);
      // tu np. odpal pobieranie wyników:
      // this.loadResults(selected);
    });
  }

  activeButtons: activeToggleButtons = {
    published: true,
    private: false,
    draft: false,
  };

  activeButtonClassName: IactiveButtonClass = {
    published: 'eff1',
    private: 'eff2',
    draft: 'eff3',
  };

  activeEffClassName: IEffClassName = {
    eff1: true,
    eff2: false,
    eff3: false,
  };

  arrayOfUserPosts: IUserPost[];
  public username: string;

  private getUserPosts() {
    this.apiService
      .getUserInfo({ username: true })
      .pipe(
        takeUntil(this.$destroySubscription),
        switchMap((userInfo: IUserAttributesResponse) => {
          if (userInfo?.success) {
            this.username = userInfo.data.username;
            return this.apiService.getUserPosts(this.username, {
              limit: 20,
              offset: 0,
              order: 'asc',
              time_created: true,
              id: true,
              like_count: true,
              comments_count: true,
              image_url: true,
              post_content: true,
              title: true,
              status: this.getActiveStatus,
            });
          } else {
            return null;
          }
        }),
      )
      .subscribe({
        next: (response: IGetUserPostsResponse) => {
          if (response.success) {
            this.arrayOfUserPosts = response.data;
            this.currentPostsSignal.set({
              currentPosts: this.arrayOfUserPosts,
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getUserInterests() {
    this.apiService
      .getUserInterests()
      .pipe(takeUntil(this.$destroySubscription))
      .subscribe({
        next: (response: IGetInterestsResponse) => {
          this.interests = response.data;
        },
      });
  }

  private getUserLanguages() {
    this.apiService
      .getUserLanguages()
      .pipe(takeUntil(this.$destroySubscription))
      .subscribe({
        next: (response: IResponseUserLanguages) => {
          this.languages = response.data;
        },
      });
  }

  setClass(event: Event) {
    // Add a class active to the element that triggered the event
    const target = event.target as HTMLElement;

    const classElement = target.classList[0];
    const bttnClassElement = this.activeButtonClassName[classElement];
    this.filters.update((current) => {
      return { ...current, status: classElement };
    });
    this.checkButtonsState(target.classList, bttnClassElement);
    this.keepOnlyActiveClass(this.activeBttn.nativeElement, 'btn');
  }

  checkButtonsState(classList: DOMTokenList, classListEff: string) {
    const classElement = classList[0];
    Object.keys(this.activeButtons).forEach((key: string) => {
      this.activeButtons[key] = key === classElement;
    });

    Object.keys(this.activeEffClassName).forEach((key: string) => {
      this.activeEffClassName[key] = key === classListEff;
    });
  }

  keepOnlyActiveClass(element: HTMLElement, defaultClass: string) {
    const buttons = this.ContainerButtons.nativeElement;
    let activeClass: string;
    Object.keys(this.activeEffClassName).forEach((key: string) => {
      if (this.activeEffClassName[key]) {
        activeClass = key;
      }
    });

    element.classList.forEach((className: string) => {
      if (className !== activeClass && className !== defaultClass) {
        element.classList.remove(className);
      }
    });

    element.classList.add(activeClass);
  }

  get getActiveStatus() {
    return Object.keys(this.activeButtons).find(
      (key) => this.activeButtons[key],
    );
  }

  toggleAdvancedSearchBox() {
    this.toggleSearchAdvancedBox.update((current) => ({
      value: !current.value,
      action: !current.value ? 'Close' : 'Show',
    }));
  }

  toggleFiltersStatus(k: keyof SearchFilters) {
    this.filters.update((current) => ({
      ...current,
      [k]: !current[k],
    }));

    if (this.filters().clearFilters) {
      this.setFiltersToDefaultState();
    }
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
    }));
  }

  // isAllFalse(object: any): boolean {
  //   return Object.values(object).every((v) => !v);
  // }

  createStreamForSearchPosts() {
    combineLatest([this.query$, this.filters$])
      .pipe(
        takeUntil(this.$destroySubscription),
        switchMap(([query, filters]) => {
          const isFalse = this.hs.isAllFalse(filters);
          console.log(filters, 'filters');

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
          this.currentPostsSignal.set({ currentPosts: this.arrayOfUserPosts });
        }
      });
  }

  onSearch(element: EventTarget) {
    const value = (element as HTMLInputElement).value;
    this.search$.next(value);
  }

  selectedItemsChange<T>($event: SelectedItemEvent) {
    if ($event.selectedItem['language_id']) {
      const exists = this.filters().languages.some(
        (l: ILanguage) => l.language_id === $event['language_id'],
      );

      if (!exists) {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            languages: [...current.languages, $event.selectedItem as ILanguage],
          };
        });
      }
    }

    if ($event.selectedItem['interest_id']) {
      const exists = this.filters().interests.some(
        (i) => i.interest_id === $event['interest_id'],
      );

      if (!exists) {
        this.filters.update((current: SearchFilters) => {
          return {
            ...current,
            interests: [...current.interests, $event.selectedItem as IInterest],
          };
        });
      }
    }
  }

  ngOnInit() {
    this.getUserPosts();
    this.getUserInterests();
    this.getUserLanguages();
    this.createStreamForSearchPosts();
  }

  ngOnDestroy(): void {
    this.$destroySubscription.next();
    this.$destroySubscription.complete();
  }
}

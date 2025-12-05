import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PostBlockComponent } from '../post-block/post-block.component';
import { FiltersBlockComponent } from '../filters-block/filters-block.component';
import { RouterLink } from '@angular/router';
import { PublishedPostsComponent } from '../published-posts/published-posts.component';
import { ApiService } from '../api-service.service';
import { forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { IGetUserPostsResponse, IUserPost } from '../types/Response/postTypes';
import { IUserAttributesResponse } from '../types/User/userTypes';

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

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [
    PostBlockComponent,
    FiltersBlockComponent,
    RouterLink,
    PublishedPostsComponent,
  ],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss',
})
export class MyPostsComponent implements OnInit, OnDestroy {
  @ViewChild('ContainerButtons') ContainerButtons: ElementRef;
  @ViewChild('activeBttn') activeBttn: ElementRef;
  $destroySubscription = new Subject<void>();

  constructor(private apiService: ApiService) {}

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
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  setClass(event: Event) {
    // Add a class active to the element that triggered the event
    const target = event.target as HTMLElement;

    const classElement = target.classList[0];
    const bttnClassElement = this.activeButtonClassName[classElement];
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

  ngOnInit() {
    this.getUserPosts();
  }

  ngOnDestroy(): void {
    this.$destroySubscription.next();
    this.$destroySubscription.complete();
  }
}

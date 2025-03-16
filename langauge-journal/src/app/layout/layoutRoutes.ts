import { Routes } from '@angular/router';
import { FeedComponent } from '../feed/feed.component';
import { ProfileComponent } from '../profile/profile.component';
import { MyPostsComponent } from '../my-posts/my-posts.component';
import { NewPostComponent } from '../new-post/new-post.component';
import { UserPostComponent } from '../user-post/user-post.component';

export const LAYOUT_ROUTS: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    children: [
      { path: 'my-feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'new-post', component: NewPostComponent },
      { path: 'post/:id', component: UserPostComponent },
      // {
      //   path: 'settings',
      //   component: SettingsComponent,
      //
      //   loadChildren: () =>
      //     import('../settings/settingRoutes').then((m) => m.LAYOUT_ROUTS),
      // },
    ],
  },
];

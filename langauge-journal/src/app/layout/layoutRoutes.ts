import { Routes } from '@angular/router';
import { FeedComponent } from '../feed/feed.component';
import { ProfileComponent } from '../profile/profile.component';
import { MyPostsComponent } from '../my-posts/my-posts.component';
import { NewPostComponent } from '../new-post/new-post.component';
import { SettingsComponent } from '../settings/settings.component';
import { authGuard } from '../auth.guard';

export const LAYOUT_ROUTS: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    children: [
      { path: 'my-feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'new-post', component: NewPostComponent },
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

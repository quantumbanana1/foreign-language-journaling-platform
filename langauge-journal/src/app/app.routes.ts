import { Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { SingInUpComponent } from './sing-in-up/sing-in-up.component';
import { LayoutComponent } from './layout/layout.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { UserPostComponent } from './user-post/user-post.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: SingInUpComponent },
  // {
  //   path: 'layout',
  //   component: LayoutComponent,
  //   canActivate: [authGuard],
  //   loadChildren: () =>
  //     import('./layout/layoutRoutes').then((m) => m.LAYOUT_ROUTS),
  // },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'my-feed', component: FeedComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'new-post', component: NewPostComponent },
      { path: 'post/:id', component: UserPostComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: 'profile-settings',
            component: ProfileSettingsComponent,
            outlet: 'settingsRouterOutlet',
          },
        ],
      },
    ],
  },
];

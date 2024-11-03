import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from '../profile-settings/profile-settings.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';

export const LAYOUT_ROUTS: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile-settings',
        component: ProfileSettingsComponent,
        outlet: 'settingsRouterOutlet',
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        outlet: 'settingsRouterOutlet',
      },
    ],
  },
];

import { Component } from '@angular/core';
import { BioProfileFormComponent } from '../bio-profile-form/bio-profile-form.component';
import { ProfileDetailsFormComponent } from '../profile-details-form/profile-details-form.component';
import { ProfileInterestsFormComponent } from '../profile-interests-form/profile-interests-form.component';
import { ProfileLanguagesFormComponent } from '../profile-languages-form/profile-languages-form.component';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    BioProfileFormComponent,
    ProfileDetailsFormComponent,
    ProfileInterestsFormComponent,
    ProfileLanguagesFormComponent,
    ChangePasswordFormComponent,
    NotificationFormComponent,
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
})
export class AccountSettingsComponent {}

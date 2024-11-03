import { Component } from '@angular/core';
import { ProfileDetailsFormComponent } from '../profile-details-form/profile-details-form.component';
import { ProfileInterestsFormComponent } from '../profile-interests-form/profile-interests-form.component';
import { BioProfileFormComponent } from '../bio-profile-form/bio-profile-form.component';
import { ProfileLanguagesFormComponent } from '../profile-languages-form/profile-languages-form.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    ProfileDetailsFormComponent,
    ProfileInterestsFormComponent,
    BioProfileFormComponent,
    ProfileLanguagesFormComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent {}

import { Component } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';
import { SelectInputComponent } from '../select-input/select-input.component';

@Component({
  selector: 'app-profile-interests-form',
  standalone: true,
  imports: [SelectLanguagesInpuntComponent, SelectInputComponent],
  templateUrl: './profile-interests-form.component.html',
  styleUrl: './profile-interests-form.component.scss',
})
export class ProfileInterestsFormComponent {}

import { Component } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';

@Component({
  selector: 'app-profile-languages-form',
  standalone: true,
  imports: [SelectLanguagesInpuntComponent],
  templateUrl: './profile-languages-form.component.html',
  styleUrl: './profile-languages-form.component.scss',
})
export class ProfileLanguagesFormComponent {}

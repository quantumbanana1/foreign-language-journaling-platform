import { Component } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';

@Component({
  selector: 'app-bio-profile-form',
  standalone: true,
  imports: [SelectLanguagesInpuntComponent],
  templateUrl: './bio-profile-form.component.html',
  styleUrl: './bio-profile-form.component.scss',
})
export class BioProfileFormComponent {}

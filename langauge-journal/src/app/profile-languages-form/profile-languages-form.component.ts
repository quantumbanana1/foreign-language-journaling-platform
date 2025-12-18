import { Component, OnInit } from '@angular/core';
import { SelectLanguagesInpuntComponent } from '../select-languages-inpunt/select-languages-inpunt.component';
import { IChooseLanguageWithLevel } from '../types/Language/languageOptionTypes';
import { ApiService } from '../api-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-languages-form',
  standalone: true,
  imports: [SelectLanguagesInpuntComponent, FormsModule],
  templateUrl: './profile-languages-form.component.html',
  styleUrl: './profile-languages-form.component.scss',
})
export class ProfileLanguagesFormComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  private selectedLanguages: IChooseLanguageWithLevel[] = [];

  getDataFromLanguageInput($event: IChooseLanguageWithLevel[]) {
    this.selectedLanguages = $event;
  }

  submitData() {
    this.uploadLanguages();
  }

  private uploadLanguages() {
    return this.apiService
      .uploadUserLanguage(this.selectedLanguages)
      .subscribe({
        next: (value) => {},
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit() {}
}

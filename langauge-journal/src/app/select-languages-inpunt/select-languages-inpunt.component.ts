import { Component, model, OnInit } from '@angular/core';
import { BadgeButtonFromSelectionComponent } from '../badge-button-from-selection/badge-button-from-selection.component';
import { NgIf } from '@angular/common';
import {
  IChooseLanguageWithLevel,
  LevelLanguage,
} from '../types/Language/languageOptionTypes';
import { toastrService } from '../toastr.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api-service.service';
import { ILanguage } from '../types/Language/langaugeResponse';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-languages-inpunt',
  standalone: true,
  imports: [BadgeButtonFromSelectionComponent, NgIf, FormsModule],
  templateUrl: './select-languages-inpunt.component.html',
  styleUrl: './select-languages-inpunt.component.scss',
})
export class SelectLanguagesInpuntComponent implements OnInit {
  public selectedOptionRowState = false;
  public selectedLanguages: IChooseLanguageWithLevel[] = [];
  private selectedLevel: LevelLanguage;
  private toastr: toastrService;
  public arrayOfLanguages: ILanguage[] = [];
  public selectedLanguage: ILanguage;
  constructor(
    private toastrs: ToastrService,
    private apiService: ApiService,
  ) {
    this.toastr = new toastrService(this.toastrs);
  }

  @Output() languageEmitter: EventEmitter<IChooseLanguageWithLevel[]> =
    new EventEmitter<IChooseLanguageWithLevel[]>();

  selected() {
    if (!this.selectedLevel) {
      return this.toastr.showToastrMessage(
        'warning',
        'You need to choose level first',
        'Warning',
      );
    }

    const isLanguageAdded = this.selectedLanguages.find(
      (item) => item.name === this.selectedLanguage.name,
    );
    if (!isLanguageAdded) {
      this.selectedLanguages.push({
        name: this.selectedLanguage.name,
        language_id: this.selectedLanguage.language_id,
        proficiency: this.selectedLevel,
        type: 'language',
      });
      this.selectedOptionRowState = true;
      return this.sendLanguagesToSubmit(this.selectedLanguages);
    } else {
      return this.toastr.showToastrMessage(
        'error',
        `You have already added ${this.selectedLanguage.name} language. To change level, please remove it first`,
      );
    }
  }

  getNotification(emittedData: IChooseLanguageWithLevel[]) {
    this.selectedLanguages = emittedData;
    this.sendLanguagesToSubmit(this.selectedLanguages);
  }

  getSelectedLevel(eventTarget: EventTarget) {
    const selectedOption = (eventTarget as HTMLInputElement)
      .value as LevelLanguage;
    if (selectedOption !== 'Select Level') {
      this.selectedLevel = selectedOption;
    }

    return 'choose language level';
  }

  reduceObject(object: IChooseLanguageWithLevel, emittedArray: string[]) {
    return Object.keys(object)
      .filter((key) => emittedArray.includes(key))
      .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
      }, {});
  }

  getAllLanguages() {
    this.apiService.getAllLanguages().subscribe({
      next: (response) => {
        this.arrayOfLanguages = response.data;
      },
      error: (error) => {
        this.toastr.showToastrMessage('error', error, 'Error');
      },
    });
  }

  sendLanguagesToSubmit(languages: IChooseLanguageWithLevel[]) {
    if (this.selectedLanguages) {
      this.languageEmitter.emit(languages);
    }
  }

  private userLanguages() {
    this.apiService.getUserLanguages().subscribe({
      next: (value) => {
        if (value.data) {
          this.selectedLanguages = value.data.map((obj) => ({
            ...obj,
            type: 'language',
          }));

          this.sendLanguagesToSubmit(this.selectedLanguages);
          this.selectedOptionRowState = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.getAllLanguages();
    this.userLanguages();
  }

  protected readonly model = model;
}

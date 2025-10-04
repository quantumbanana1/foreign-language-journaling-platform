import { Component, Input } from '@angular/core';
import {
  IChooseLanguageWithLevel,
  LevelLanguage,
} from '../types/Language/languageOptionTypes';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-lng-level',
  standalone: true,
  imports: [NgClass],
  templateUrl: './lng-level.component.html',
  styleUrl: './lng-level.component.scss',
})
export class LngLevelComponent {
  @Input() language!: IChooseLanguageWithLevel;

  public shouldStop(index: number) {
    switch (this.language.proficiency) {
      case LevelLanguage.Beginner:
        return index >= 1;

      case LevelLanguage.Intermediate:
        return index >= 2;

      case LevelLanguage.Advanced:
        return index >= 3;

      case LevelLanguage.Native:
        return false;

      default:
        return false;
    }
  }
}

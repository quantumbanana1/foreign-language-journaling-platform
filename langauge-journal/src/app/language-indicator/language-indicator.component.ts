import {Component, Input, SimpleChanges} from '@angular/core';
import {CommonModule} from "@angular/common";

interface onChanges {
}

@Component({
  selector: 'app-language-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-indicator.component.html',
  styleUrl: './language-indicator.component.scss'
})
export class LanguageIndicatorComponent implements onChanges {

  @Input() language: string = '';
  @Input() selectedLanguage!: string;
  public languageIndicatorState: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    this.languageIndicatorState = !(this.selectedLanguage === 'Languages' || this.selectedLanguage === '');

  }


}

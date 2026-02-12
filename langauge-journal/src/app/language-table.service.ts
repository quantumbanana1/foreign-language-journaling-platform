import { Injectable, signal } from '@angular/core';
import { ILanguage } from './types/Language/langaugeResponse';

@Injectable({
  providedIn: 'root',
})
export class LanguageTableService {
  private readonly _selected = signal<readonly ILanguage[]>([]);
  readonly selected = this._selected.asReadonly();

  setSelected(next: readonly ILanguage[]) {
    this._selected.set([...next]);
  }

  clear() {
    this._selected.set([]);
  }

  constructor() {}
}

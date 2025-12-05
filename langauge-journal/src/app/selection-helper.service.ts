import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectionHelperService<T> {
  constructor() {}

  getLabel(item: T, name: string) {
    if (item[name] !== undefined) {
      return item[name];
    }

    if (name === 'id' && item['id'] === undefined) {
      if (item['language_id'] !== undefined) {
        return item['language_id'];
      }

      if (item['interest_id'] !== undefined) {
        return item['interest_id'];
      }
    }

    return 'Unknown';
  }
}

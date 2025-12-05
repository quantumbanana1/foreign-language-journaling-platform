import { Injectable } from '@angular/core';
import {
  IChooseLanguageWithLevel,
  LevelLanguage,
} from './types/Language/languageOptionTypes';
import { IInterest } from './types/Response/getInterestsResponse';

type ItemFromBadge =
  | {
      type: 'language';
      name: string;
      language_id: number;
      proficiency: LevelLanguage;
    }
  | { type: 'interest'; name: string; interest_id: number };

type arrayOfInterest = Array<IChooseLanguageWithLevel | IInterest>;

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  public filterObject<T extends object>(
    obj: T,
    fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean,
  ) {
    return Object.fromEntries(
      (Object.entries(obj) as Entry<T>[]).filter(fn),
    ) as Partial<T>;
  }

  public filterChangedPropertiesInObject<T extends Object>(
    newObject: T,
    oldObject: T,
  ) {
    const filteredUserInfo: Partial<T> = this.filterObject(
      newObject,
      ([k, v]: Entry<T>): boolean => v !== oldObject[k],
    );
    return filteredUserInfo;
  }

  public updateObjectWithNewValues<T extends object>(newObj: T, oldObj: T): T {
    return Object.assign(newObj, oldObj);
  }

  public removeItemFromArray(
    arrOfObj: arrayOfInterest,
    name: string,
  ): ItemFromBadge {
    const removeIndex = arrOfObj.map((item) => item.name).indexOf(name);
    const itemToDelete = arrOfObj[removeIndex];
    removeIndex >= 0 && arrOfObj.splice(removeIndex, 1);
    return itemToDelete;
  }

  public removeItemFromArrayById<T extends Record<string, any>>(
    arr: T[],
    id: string,
    key: string,
  ) {
    const index = arr.findIndex((item) => String(item[key]) === id);

    if (index >= 0) {
      const removed = arr[index];
      arr.splice(index, 1);
      return removed;
    }

    return null;
  }

  public getPropertyFromArray(arr: object[], property: string) {
    return arr.map((object) => object[property]);
  }

  public estimateReadingTime(text: string) {
    const wordsPerMinute = 200;

    const amountOfWords = text.split(' ').length;

    console.log('ammounbt fo words', amountOfWords);
    console.log(Math.round(amountOfWords / wordsPerMinute));
    return Math.round(amountOfWords / wordsPerMinute);
  }

  public sterylizeHTMLtoGetContent(postContent: string) {
    const matches = [...postContent.matchAll(/>([^<]+)</g)].map((m) => m[1]);
    let text: string = '';

    matches.forEach((string, index) => {
      text += string;
      if (index !== matches.length - 1) {
        text += ' ';
      }
    });
    console.log(text);
    return text;
  }

  public formatDate(dateToFormat: string) {
    const date = new Date(dateToFormat);

    const formatted = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long', // March
      year: 'numeric',
    }).format(date);

    return formatted;
  }
}

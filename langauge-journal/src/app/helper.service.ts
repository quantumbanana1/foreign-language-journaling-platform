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

  public getPropertyFromArray(arr: object[], property: string) {
    return arr.map((object) => object[property]);
  }
}

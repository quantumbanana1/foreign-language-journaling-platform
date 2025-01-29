import { Injectable } from '@angular/core';

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
}

import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputPostBindingService {

  public inputValue = new Subject<string>();
  inputData = this.inputValue.asObservable();

  public inputValuesInterests = new Subject<string[]>();
  inputDataInterests = this.inputValuesInterests.asObservable();


  public popUpStateSubject = new Subject<boolean>();
  popUpStateObservable = this.popUpStateSubject.asObservable();


  constructor() {
  }


  updateValue(value: string) {

    this.inputValue.next(value);

  }

  updateValueInterests(value: string[]) {
    console.log(value)
    this.inputValuesInterests.next(value);

  }

  updatePopUpState(value: boolean) {
    this.popUpStateSubject.next(value);
  }
}

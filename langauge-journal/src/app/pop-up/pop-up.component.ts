import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputPostBindingService } from '../input-post-binding.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss',
})
export class PopUpComponent implements OnInit, OnDestroy {
  popUpState: boolean;
  constructor(private inputBindingsService: InputPostBindingService) {}
  closePopUp() {
    this.popUpState = false;
  }

  private destroy$ = new Subject<void>();

  subscribeToPopUpState() {
    this.inputBindingsService.popUpStateSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.popUpState = true;
      });
  }

  ngOnInit(): void {
    this.subscribeToPopUpState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

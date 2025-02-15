import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInterestsInputComponent } from './select-interests-input.component';

describe('SelectInterestsInputComponent', () => {
  let component: SelectInterestsInputComponent;
  let fixture: ComponentFixture<SelectInterestsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInterestsInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectInterestsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

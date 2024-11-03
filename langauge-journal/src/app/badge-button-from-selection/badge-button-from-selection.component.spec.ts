import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeButtonFromSelectionComponent } from './badge-button-from-selection.component';

describe('BadgeButtonFromSelectionComponent', () => {
  let component: BadgeButtonFromSelectionComponent;
  let fixture: ComponentFixture<BadgeButtonFromSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeButtonFromSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BadgeButtonFromSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

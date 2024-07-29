import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestsIndicatorComponent } from './interests-indicator.component';

describe('InterestsIndicatorComponent', () => {
  let component: InterestsIndicatorComponent;
  let fixture: ComponentFixture<InterestsIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterestsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

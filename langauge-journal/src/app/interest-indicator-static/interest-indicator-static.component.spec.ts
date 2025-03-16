import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestIndicatorStaticComponent } from './interest-indicator-static.component';

describe('InterestIndicatorStaticComponent', () => {
  let component: InterestIndicatorStaticComponent;
  let fixture: ComponentFixture<InterestIndicatorStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestIndicatorStaticComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterestIndicatorStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

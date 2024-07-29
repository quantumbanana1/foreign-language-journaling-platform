import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageIndicatorComponent } from './language-indicator.component';

describe('LanguageIndicatorComponent', () => {
  let component: LanguageIndicatorComponent;
  let fixture: ComponentFixture<LanguageIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

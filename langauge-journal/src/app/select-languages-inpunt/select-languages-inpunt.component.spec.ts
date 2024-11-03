import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguagesInpuntComponent } from './select-languages-inpunt.component';

describe('SelectLanguagesInpuntComponent', () => {
  let component: SelectLanguagesInpuntComponent;
  let fixture: ComponentFixture<SelectLanguagesInpuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguagesInpuntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectLanguagesInpuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

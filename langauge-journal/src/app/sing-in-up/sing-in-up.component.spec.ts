import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingInUpComponent } from './sing-in-up.component';

describe('SingInUpComponent', () => {
  let component: SingInUpComponent;
  let fixture: ComponentFixture<SingInUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingInUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingInUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

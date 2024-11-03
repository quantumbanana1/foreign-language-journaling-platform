import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioProfileFormComponent } from './bio-profile-form.component';

describe('BioProfileFormComponent', () => {
  let component: BioProfileFormComponent;
  let fixture: ComponentFixture<BioProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioProfileFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BioProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLanguagesFormComponent } from './profile-languages-form.component';

describe('ProfileLanguagesFormComponent', () => {
  let component: ProfileLanguagesFormComponent;
  let fixture: ComponentFixture<ProfileLanguagesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLanguagesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileLanguagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

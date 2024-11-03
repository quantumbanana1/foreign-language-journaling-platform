import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInterestsFormComponent } from './profile-interests-form.component';

describe('ProfileInterestsFormComponent', () => {
  let component: ProfileInterestsFormComponent;
  let fixture: ComponentFixture<ProfileInterestsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInterestsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileInterestsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarProfileComponent } from './side-bar-profile.component';

describe('SideBarProfileComponent', () => {
  let component: SideBarProfileComponent;
  let fixture: ComponentFixture<SideBarProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideBarProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

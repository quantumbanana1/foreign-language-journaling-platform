import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LngLevelComponent } from './lng-level.component';

describe('LngLevelComponent', () => {
  let component: LngLevelComponent;
  let fixture: ComponentFixture<LngLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LngLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LngLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

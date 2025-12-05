import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionBlockComponent } from './selection-block.component';

describe('SelectionBlockComponent', () => {
  let component: SelectionBlockComponent;
  let fixture: ComponentFixture<SelectionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

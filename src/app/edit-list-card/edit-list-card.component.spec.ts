import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListCardComponent } from './edit-list-card.component';

describe('EditListCardComponent', () => {
  let component: EditListCardComponent;
  let fixture: ComponentFixture<EditListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditListCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

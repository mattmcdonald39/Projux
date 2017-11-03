import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEditCardComponent } from './custom-edit-card.component';

describe('CustomEditCardComponent', () => {
  let component: CustomEditCardComponent;
  let fixture: ComponentFixture<CustomEditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

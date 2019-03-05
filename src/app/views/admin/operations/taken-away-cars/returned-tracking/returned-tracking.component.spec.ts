import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedTrackingComponent } from './returned-tracking.component';

describe('ReturnedTrackingComponent', () => {
  let component: ReturnedTrackingComponent;
  let fixture: ComponentFixture<ReturnedTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnedTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

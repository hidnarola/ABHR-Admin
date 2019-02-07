import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredTrackingComponent } from './delivered-tracking.component';

describe('DeliveredTrackingComponent', () => {
  let component: DeliveredTrackingComponent;
  let fixture: ComponentFixture<DeliveredTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveredTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveredTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

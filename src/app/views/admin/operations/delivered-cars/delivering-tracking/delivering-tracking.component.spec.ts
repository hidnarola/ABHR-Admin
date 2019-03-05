import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveringTrackingComponent } from './delivering-tracking.component';

describe('DeliveringTrackingComponent', () => {
  let component: DeliveringTrackingComponent;
  let fixture: ComponentFixture<DeliveringTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveringTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveringTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

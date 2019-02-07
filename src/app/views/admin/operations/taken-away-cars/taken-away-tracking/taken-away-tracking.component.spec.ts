import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenAwayTrackingComponent } from './taken-away-tracking.component';

describe('TakenAwayTrackingComponent', () => {
  let component: TakenAwayTrackingComponent;
  let fixture: ComponentFixture<TakenAwayTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakenAwayTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakenAwayTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

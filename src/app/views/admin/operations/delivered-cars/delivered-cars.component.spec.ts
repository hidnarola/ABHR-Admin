import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredCarsComponent } from './delivered-cars.component';

describe('DeliveredCarsComponent', () => {
  let component: DeliveredCarsComponent;
  let fixture: ComponentFixture<DeliveredCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveredCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveredCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

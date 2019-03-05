import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedCarsComponent } from './reported-cars.component';

describe('ReportedCarsComponent', () => {
  let component: ReportedCarsComponent;
  let fixture: ComponentFixture<ReportedCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

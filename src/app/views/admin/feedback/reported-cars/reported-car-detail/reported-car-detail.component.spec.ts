import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedCarDetailComponent } from './reported-car-detail.component';

describe('ReportedCarDetailComponent', () => {
  let component: ReportedCarDetailComponent;
  let fixture: ComponentFixture<ReportedCarDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedCarDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedCarDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

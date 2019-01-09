import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCarReportComponent } from './admin-car-report.component';

describe('AdminCarReportComponent', () => {
  let component: AdminCarReportComponent;
  let fixture: ComponentFixture<AdminCarReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCarReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCarReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

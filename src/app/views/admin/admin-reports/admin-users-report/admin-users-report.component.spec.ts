import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersReportComponent } from './admin-users-report.component';

describe('AdminUsersReportComponent', () => {
  let component: AdminUsersReportComponent;
  let fixture: ComponentFixture<AdminUsersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

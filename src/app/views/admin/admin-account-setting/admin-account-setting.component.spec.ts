import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountSettingComponent } from './admin-account-setting.component';

describe('AdminAccountSettingComponent', () => {
  let component: AdminAccountSettingComponent;
  let fixture: ComponentFixture<AdminAccountSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAccountSettingComponent } from './company-account-setting.component';

describe('CompanyAccountSettingComponent', () => {
  let component: CompanyAccountSettingComponent;
  let fixture: ComponentFixture<CompanyAccountSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAccountSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAccountSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

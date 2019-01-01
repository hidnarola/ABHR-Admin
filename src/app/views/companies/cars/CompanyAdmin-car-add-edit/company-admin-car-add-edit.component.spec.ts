import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAddEditComponent } from './company-admin-car-add-edit.component';

describe('CompanyAdminCarAddEditComponent', () => {
  let component: CarAddEditComponent;
  let fixture: ComponentFixture<CarAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

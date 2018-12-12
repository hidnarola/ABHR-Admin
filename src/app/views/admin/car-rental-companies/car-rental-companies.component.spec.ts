import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalCompaniesComponent } from './car-rental-companies.component';

describe('CarRentalCompaniesComponent', () => {
  let component: CarRentalCompaniesComponent;
  let fixture: ComponentFixture<CarRentalCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarRentalCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRentalCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

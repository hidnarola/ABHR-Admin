import { CarRentalCompaniesModule } from './car-rental-companies.module';

describe('CarRentalCompaniesModule', () => {
  let carRentalCompaniesModule: CarRentalCompaniesModule;

  beforeEach(() => {
    carRentalCompaniesModule = new CarRentalCompaniesModule();
  });

  it('should create an instance', () => {
    expect(carRentalCompaniesModule).toBeTruthy();
  });
});

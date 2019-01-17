import { AdminTermsModule } from './admin-terms.module';

describe('AdminTermsModule', () => {
  let adminTermsModule: AdminTermsModule;

  beforeEach(() => {
    adminTermsModule = new AdminTermsModule();
  });

  it('should create an instance', () => {
    expect(adminTermsModule).toBeTruthy();
  });
});

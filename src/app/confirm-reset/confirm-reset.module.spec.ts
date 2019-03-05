import { ConfirmResetModule } from './confirm-reset.module';

describe('ConfirmResetModule', () => {
  let confirmResetModule: ConfirmResetModule;

  beforeEach(() => {
    confirmResetModule = new ConfirmResetModule();
  });

  it('should create an instance', () => {
    expect(confirmResetModule).toBeTruthy();
  });
});

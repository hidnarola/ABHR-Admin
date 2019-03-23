import { NotFoundPageModule } from './not-found-page.module';

describe('NotFoundPageModule', () => {
  let notFoundPageModule: NotFoundPageModule;

  beforeEach(() => {
    notFoundPageModule = new NotFoundPageModule();
  });

  it('should create an instance', () => {
    expect(notFoundPageModule).toBeTruthy();
  });
});

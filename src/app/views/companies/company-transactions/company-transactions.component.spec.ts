import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTransactionsComponent } from './company-transactions.component';

describe('CompanyTransactionsComponent', () => {
  let component: CompanyTransactionsComponent;
  let fixture: ComponentFixture<CompanyTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

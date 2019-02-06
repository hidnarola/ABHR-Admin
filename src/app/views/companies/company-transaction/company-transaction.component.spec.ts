import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTransactionComponent } from './company-transaction.component';

describe('CompanyTransactionComponent', () => {
  let component: CompanyTransactionComponent;
  let fixture: ComponentFixture<CompanyTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

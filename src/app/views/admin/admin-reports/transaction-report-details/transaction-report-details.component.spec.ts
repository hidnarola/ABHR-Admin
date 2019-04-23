import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReportDetailsComponent } from './transaction-report-details.component';

describe('TransactionReportDetailsComponent', () => {
  let component: TransactionReportDetailsComponent;
  let fixture: ComponentFixture<TransactionReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

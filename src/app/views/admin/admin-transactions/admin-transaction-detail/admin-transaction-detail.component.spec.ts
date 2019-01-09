import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTransactionDetailComponent } from './admin-transaction-detail.component';

describe('AdminTransactionDetailComponent', () => {
  let component: AdminTransactionDetailComponent;
  let fixture: ComponentFixture<AdminTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

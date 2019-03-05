import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoiceComponent } from './admin-invoice.component';

describe('AdminInvoiceComponent', () => {
  let component: AdminInvoiceComponent;
  let fixture: ComponentFixture<AdminInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

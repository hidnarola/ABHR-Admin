import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationChargeComponent } from './cancellation-charge.component';

describe('CancellationChargeComponent', () => {
  let component: CancellationChargeComponent;
  let fixture: ComponentFixture<CancellationChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

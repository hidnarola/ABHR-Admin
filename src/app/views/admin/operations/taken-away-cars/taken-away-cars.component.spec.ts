import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenAwayCarsComponent } from './taken-away-cars.component';

describe('TakenAwayCarsComponent', () => {
  let component: TakenAwayCarsComponent;
  let fixture: ComponentFixture<TakenAwayCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakenAwayCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakenAwayCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAddEditComponent } from './agent-add-edit.component';

describe('AgentAddEditComponent', () => {
  let component: AgentAddEditComponent;
  let fixture: ComponentFixture<AgentAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

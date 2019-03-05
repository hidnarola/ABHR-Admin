import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackCategoryComponent } from './feedback-category.component';

describe('FeedbackCategoryComponent', () => {
  let component: FeedbackCategoryComponent;
  let fixture: ComponentFixture<FeedbackCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

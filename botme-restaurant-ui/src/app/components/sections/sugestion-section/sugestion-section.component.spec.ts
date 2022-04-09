import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestionSectionComponent } from './sugestion-section.component';

describe('SugestionSectionComponent', () => {
  let component: SugestionSectionComponent;
  let fixture: ComponentFixture<SugestionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugestionSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SugestionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

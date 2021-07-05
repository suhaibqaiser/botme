import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSectionComponent } from './special-section.component';

describe('SpecialSectionComponent', () => {
  let component: SpecialSectionComponent;
  let fixture: ComponentFixture<SpecialSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

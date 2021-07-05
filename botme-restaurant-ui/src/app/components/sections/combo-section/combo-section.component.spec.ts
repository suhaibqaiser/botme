import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboSectionComponent } from './combo-section.component';

describe('ComboSectionComponent', () => {
  let component: ComboSectionComponent;
  let fixture: ComponentFixture<ComboSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

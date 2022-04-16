import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupFormSectionComponent } from './signup-form-section.component';

describe('SignupFormSectionComponent', () => {
  let component: SignupFormSectionComponent;
  let fixture: ComponentFixture<SignupFormSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupFormSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

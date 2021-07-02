import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicySectionComponent } from './privacy-policy-section.component';

describe('PrivacyPolicySectionComponent', () => {
  let component: PrivacyPolicySectionComponent;
  let fixture: ComponentFixture<PrivacyPolicySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicySectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

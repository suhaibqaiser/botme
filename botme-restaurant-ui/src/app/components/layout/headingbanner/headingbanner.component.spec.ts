import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingbannerComponent } from './headingbanner.component';

describe('HeadingbannerComponent', () => {
  let component: HeadingbannerComponent;
  let fixture: ComponentFixture<HeadingbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingbannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeProductModalComponent } from './customize-product-modal.component';

describe('CustomizeProductModalComponent', () => {
  let component: CustomizeProductModalComponent;
  let fixture: ComponentFixture<CustomizeProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

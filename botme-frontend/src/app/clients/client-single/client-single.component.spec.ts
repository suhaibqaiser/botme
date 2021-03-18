import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSingleComponent } from './client-single.component';

describe('ClientSingleComponent', () => {
  let component: ClientSingleComponent;
  let fixture: ComponentFixture<ClientSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

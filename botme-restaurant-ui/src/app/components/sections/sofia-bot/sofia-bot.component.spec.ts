import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SofiaBotComponent } from './sofia-bot.component';

describe('SofiaBotComponent', () => {
  let component: SofiaBotComponent;
  let fixture: ComponentFixture<SofiaBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SofiaBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SofiaBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

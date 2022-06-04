import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedpalHomeComponent } from './medpal-home.component';

describe('MedpalHomeComponent', () => {
  let component: MedpalHomeComponent;
  let fixture: ComponentFixture<MedpalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedpalHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedpalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

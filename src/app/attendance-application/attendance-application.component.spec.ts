import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceApplicationComponent } from './attendance-application.component';

describe('AttendanceApplicationComponent', () => {
  let component: AttendanceApplicationComponent;
  let fixture: ComponentFixture<AttendanceApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

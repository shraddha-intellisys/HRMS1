import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationApprovalComponent } from './resignation-approval.component';

describe('ResignationApprovalComponent', () => {
  let component: ResignationApprovalComponent;
  let fixture: ComponentFixture<ResignationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResignationApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

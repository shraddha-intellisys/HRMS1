import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // ✅ We will use HttpClient here

@Component({
  selector: 'app-attendance-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance-application.component.html',
  styleUrls: ['./attendance-application.component.css']
})
export class AttendanceApplicationComponent implements OnInit {
  attendanceForm: FormGroup;
  employeeName: string = 'Shraddha'; 
  employeeCode: string = 'SM123';   
  isSubmitting: boolean = false;
  isTimeBasisSelected: boolean = false;
  isDayBasisSelected: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient // ✅ Inject HttpClient here
  ) {
    this.attendanceForm = this.fb.group({
      applicationDate: ['', Validators.required],
      applicationType: ['casual', Validators.required],
      leaveType: ['full', Validators.required],
      reason: ['', Validators.required],
      remarks: [''],
      ccTo: ['', [Validators.email]],
      attendanceBasis: ['day', Validators.required],
      startTime: [''],
      endTime: [''],
      fromDate: [''],
      toDate: [''],
      fromHalf: [false],
      firstHalf: [false],
      secondHalf: [false],
    });
  }

  ngOnInit(): void {
    this.onBasisChange(this.attendanceForm.get('attendanceBasis')?.value);
  }

  onBasisChange(basis: string): void {
    this.isTimeBasisSelected = basis === 'time';
    this.isDayBasisSelected = basis === 'day';

    if (this.isTimeBasisSelected) {
      this.attendanceForm.get('fromDate')?.reset();
      this.attendanceForm.get('toDate')?.reset();
      this.attendanceForm.get('startTime')?.setValidators([Validators.required]);
      this.attendanceForm.get('endTime')?.setValidators([Validators.required]);
      this.attendanceForm.get('fromHalf')?.clearValidators();
      this.attendanceForm.get('firstHalf')?.clearValidators();
      this.attendanceForm.get('secondHalf')?.clearValidators();
    } else {
      this.attendanceForm.get('startTime')?.reset();
      this.attendanceForm.get('endTime')?.reset();
      this.attendanceForm.get('startTime')?.clearValidators();
      this.attendanceForm.get('endTime')?.clearValidators();
      this.attendanceForm.get('fromDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('toDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('fromHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('firstHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('secondHalf')?.setValidators([Validators.requiredTrue]);
    }

    this.updateFieldValidations();
  }

  private updateFieldValidations(): void {
    const fields = ['startTime', 'endTime', 'fromDate', 'toDate', 'fromHalf', 'firstHalf', 'secondHalf'];
    fields.forEach(field => this.attendanceForm.get(field)?.updateValueAndValidity());
  }

  // ✅ FINAL: Submit Attendance Application Directly to API
  onSubmit(): void {
    if (this.attendanceForm.invalid) {
      console.log('❗ Form is invalid.');
      return;
    }

    const payload = {
      employeeName: this.employeeName,
      employeeCode: this.employeeCode,
      ...this.attendanceForm.value
    };

    console.log('📤 Submitting Attendance Application:', payload);
    this.isSubmitting = true;

    // ✅ Direct integration using HttpClient
    this.http.post('http://localhost:5000/api/attendance-application', payload)
      .subscribe({
        next: (res) => {
          console.log('✅ Application Submitted Successfully:', res);
          alert('✅ Attendance Application Submitted Successfully!');
          this.attendanceForm.reset({
            applicationType: 'casual',
            leaveType: 'full',
            attendanceBasis: 'day'
          });
          this.onBasisChange('day');
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('❌ Error submitting application:', err);
          alert('❌ Failed to submit attendance application.');
          this.isSubmitting = false;
        }
      });
  }
  
}



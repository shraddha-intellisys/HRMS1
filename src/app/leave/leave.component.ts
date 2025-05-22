import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leave',
  standalone: true,
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  employeeName = 'John Doe';
  employeeCode = 'EMP123';
  static submitLeave: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      applicationDate: ['', Validators.required],
      applicationType: ['', Validators.required],
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      fromHalf: [false],
      firstHalfFrom: [false],
      secondHalfFrom: [false],
      toDate: ['', Validators.required],
      toHalf: [false],
      firstHalfTo: [false],
      reason: ['', Validators.required],
      remarks: [''],
      ccTo: ['', [Validators.email]]
    });
  }

  submitLeave(): void {
    if (this.leaveForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = this.leaveForm.value;

    this.http.post('http://localhost:5000/api/leave/submit', formData).subscribe({
      next: () => {
        alert('Leave submitted successfully!');
        this.leaveForm.reset();
      },
      error: (err) => {
        console.error('Error submitting leave:', err);
        alert('Submission failed.');
      }
    });
  }

  cancelLeave(): void {
    this.leaveForm.reset();
  }
}

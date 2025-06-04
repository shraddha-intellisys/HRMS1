import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resignation',
  standalone: true,
  templateUrl: './resignation.component.html',
  styleUrls: ['./resignation.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResignationComponent {
  resignationForm: FormGroup;
  showForm = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.resignationForm = this.fb.group({
      employeeCode: ['', Validators.required],
      employeeName: ['', Validators.required],
      department: ['', Validators.required],
      lastWorkingDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  toggleForm() {
    this.showForm = true;
  }

  submitResignation() {
    if (this.resignationForm.valid) {
      this.http.post('http://localhost:5000/api/resignation/submit', this.resignationForm.value)
        .subscribe({
          next: () => {
            alert('Resignation submitted successfully.');
            this.resignationForm.reset();
            this.showForm = false;
          },
          error: (error: any) => {
            alert('Error submitting resignation.');
            console.error(error);
          }
        });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  profileData: any = null;
  isSubmitting = false;
  upcomingBirthdays: any[] = []; // New property to hold upcoming birthdays

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {

// Assuming you are using ReactiveFormsModule
this.employeeForm = this.fb.group({
  name: [''],
  email: [''],
  employeeCode: [''],
  gender: [''],
  location: [''],
  department: [''],
  manager: [''],
  joiningDate: [null],
  salary: [0],
  panNumber: [''],
  aadharNumber: [''],
  branch: [''],
  grade: [''],
  designation: [''],
  projectType: [''],
  imageUrl: [''],
  dateOfBirth: [null],
  epsJoiningDate: [null],  
  epsExitDate: [null],    
  esicNo: [''],            
  previousMemberId: [''], 
   
  epsNo: ['']             
});


  }

  ngOnInit(): void {
    this.loadEmployeeProfile();
    this.getUpcomingBirthdays();  // Fetch the upcoming birthdays
  }

  // ✅ Load profile for logged-in user
  private loadEmployeeProfile(): void {
    this.employeeService.getEmployeeProfile();

    this.employeeService.employeeProfile$.subscribe({
      next: (employee) => {
        if (employee) {
          this.profileData = employee;
          this.employeeForm.patchValue({
            ...employee,
            joiningDate: this.formatDate(employee.joiningDate),
            dateOfBirth: this.formatDate(employee.dateOfBirth),
            epsJoiningDate: this.formatDate(employee.epsJoiningDate),
            epsExitDate: this.formatDate(employee.epsExitDate)
          });
          console.log("✅ Profile loaded");
        }
      },
      error: (err: any) => {
        console.error("❌ Error loading profile:", err);
        if (err.status === 401) {
          alert("Session expired. Please login again.");
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // ✅ Fetch upcoming birthdays
  getUpcomingBirthdays(): void {
    this.employeeService.getUpcomingBirthdays().subscribe(
      (data) => {
        this.upcomingBirthdays = data;  // Assign the data to upcomingBirthdays
      },
      (error) => {
        console.error('Error fetching upcoming birthdays:', error);
      }
    );
  }

  // ✅ Submit form (create or update employee)
  submitEmployeeForm(): void {
    if (this.employeeForm.invalid) {
      alert('⚠️ Please fill in all required fields correctly.');
      return;
    }

    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired()) {
      alert('❌ Session expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    const formData = this.employeeForm.value;

    const request$: Observable<any> = this.profileData && this.profileData._id
      ? this.employeeService.updateEmployee(this.profileData._id, formData)
      : this.employeeService.addEmployee(formData);

    request$.subscribe({
      next: () => {
        alert('🎉 Employee details saved successfully!');
        this.loadEmployeeProfile();
        this.isSubmitting = false;
      },
      error: (err: any) => {
        alert(err.error?.message || 'An error occurred while saving employee data.');
        this.isSubmitting = false;
      }
    });
  }

  // ✅ Handle image upload
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ File size exceeds 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.employeeForm.patchValue({ imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  // ✅ Format dates for form inputs
  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
}

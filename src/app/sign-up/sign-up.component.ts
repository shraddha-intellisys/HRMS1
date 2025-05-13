import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignUpComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false; // 🔄 Loading state

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // 🔹 Handle form submission
  async onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const userData = this.signupForm.value;
    console.log('🚀 Sending Signup Request:', JSON.stringify(userData)); // ✅ Log data

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      console.log('🔍 Response Status:', response.status);

      const data = await response.json();
      console.log('🛠️ Server Response:', data); // ✅ Log response from server

      if (!response.ok) {
        throw new Error(data.message || 'Sign-Up Failed.');
      }

      this.successMessage = `Sign-Up Successful! Your Employee ID is: ${data.empID}`;
      console.log("Generated Employee ID:", data.empID); 

      this.signupForm.reset();

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Signup Error:', error.message);
      this.errorMessage = error.message || 'An error occurred. Please try again.';
    }
  }

  // 🔹 Navigate to login page (FIXED)
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

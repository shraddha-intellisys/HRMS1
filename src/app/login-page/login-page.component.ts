import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LoginPageComponent {
  @ViewChild('loginForm') loginForm!: NgForm; // ✅ Reference to form

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}
  async login(loginForm: NgForm) {
    if (!loginForm.valid) {
      alert('❌ Please enter a valid username and password.');
      return;
    }
  
    const { username, password } = loginForm.value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || '❌ Login failed');
      }
  
      if (!data.employeeId) {
        throw new Error('❌ Employee verification failed. No employeeId returned.');
      }
  
      // ✅ Store employeeId in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('employeeId', data.employeeId);
      localStorage.setItem('username', data.username);
  
      alert(`✅ Login successful! Welcome Employee: ${data.employeeId}`);
  
      this.router.navigate(['/right']);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '❌ An unexpected error occurred.');
    }
  }
}
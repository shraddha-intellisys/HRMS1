import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  isLoading = true;
  errorMessage = '';

  // For dynamic status cards
  statusFields = [
    { label: 'Branch', key: 'branch' },
    { label: 'Department', key: 'department' },
    { label: 'Grade', key: 'grade' },
    { label: 'Designation', key: 'designation' },
    { label: 'Employee Category', key: 'employeeCategory' },
    { label: 'Project Type', key: 'projectType' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const token = this.authService.getToken();

    if (!token) {
      console.warn("⚠️ Missing token. Redirecting to login.");
      this.handleUnauthorizedAccess();
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    console.log("🔍 Fetching employee profile using token...");

    this.http.get<{ employee?: any }>('http://localhost:5000/api/employees/profile', { headers })
      .subscribe({
        next: (response) => {
          if (response?.employee) {
            console.log("✅ Profile data received:", response.employee);
            this.profileData = response.employee;
          } else {
            this.errorMessage = 'Employee profile not found.';
          }
        },
        error: (error) => {
          console.error("❌ Error loading profile:", error);
          if ([401, 403].includes(error.status)) {
            this.handleUnauthorizedAccess();
          } else {
            this.errorMessage = 'Error fetching profile. Please try again later.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private handleUnauthorizedAccess(): void {
    console.warn("🔴 Unauthorized or expired session. Logging out.");
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

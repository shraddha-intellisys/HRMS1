import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css'],
})
export class RightComponent implements OnInit {
  username = '';
  employeeCode = '';
  employeeName = '';
  branch = '';
  department = '';
  email = '';
  projectType = '';
  joiningDate = '';
  imageUrl = '';
  dob: string = '';
  currentTime = '';
  currentDate = '';
  showProfile = false;

  emp: any = {};
  upcomingBirthdays: any[] = [];
  birthdaysThisMonth: any[] = [];
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];

  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.getEmployeeDetails();
    this.initClock();
    this.setCurrentDate();
    this.fetchEmployees();
    this.getUpcomingBirthdays();
  }

  private loadUserInfo(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      this.fetchUserProfile();
    }
  }

  private fetchEmployees(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/employees`, { headers }).subscribe({
      next: (res) => {
        const employees: any[] = res?.employees || [];
        const loggedInEmpID = this.authService.getEmployeeId();
        this.filteredEmployees = employees.filter((emp: any) => emp.empID !== loggedInEmpID);
      },
      error: (err) => console.error('❌ Error fetching employees for reminders:', err),
    });
  }

  private fetchUserProfile(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/profile`, { headers }).subscribe({
      next: (data) => {
        if (data?.success && data.username) {
          this.username = data.username;
          localStorage.setItem('username', this.username);
        }
      },
      error: (err) => console.error('❌ Error fetching user profile:', err),
    });
  }

  private getEmployeeDetails(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/employees/profile`, { headers }).subscribe({
      next: (res) => {
        const emp = res?.employee;
        if (!emp) {
          console.warn('⚠️ No employee data found.');
          return;
        }

        this.emp = emp;

        this.employeeName = emp.name || 'Employee';
        this.employeeCode = emp.employeeCode || 'N/A';
        this.branch = emp.branch || 'N/A';
        this.department = emp.department || 'N/A';
        this.email = emp.email || 'N/A';
        this.projectType = emp.projectType || 'N/A';
        this.joiningDate = this.formatDate(emp.joiningDate);
        this.dob = this.formatDate(emp.dateOfBirth);

        this.imageUrl = emp.image?.startsWith('http')
          ? emp.image
          : emp.image
            ? `http://localhost:5000/${emp.image}`
            : 'assets/employee (1).png';
      },
      error: (err) => console.error('❌ Error fetching employee details:', err),
    });
  }

  private initClock(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private setCurrentDate(): void {
    const today = new Date();
    this.currentDate = today.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Updated method to fetch upcoming birthdays with proper headers and URL
  getUpcomingBirthdays() {
    const headers = this.createAuthHeaders();
    this.http.get(`${this.API_URL}/employees/upcoming-birthdays`, { headers }).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.upcomingBirthdays = this.filterUpcomingBirthdays(response.upcomingBirthdays || []);
        }
      },
      error: (err) => {
        console.error('❌ Error fetching upcoming birthdays:', err);
      }
    });
  }

  private filterUpcomingBirthdays(employees: any[]): any[] {
    const today = new Date();
    const upcoming = employees.filter(emp => {
      const empBirthday = new Date(emp.dateOfBirth);
      empBirthday.setFullYear(today.getFullYear());
      return empBirthday >= today;
    }).slice(0, 5);
    return upcoming;
  }
}

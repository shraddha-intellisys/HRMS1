import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';




@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // User properties
  username = 'Shraddha';
  employeeCode = 'EMP00123';
  employeeName = 'Shraddha Meshram';
  branch = 'Mumbai';
  department = 'HR';
  email = 'shraddha@intellisys.com';
  projectType = 'Admin Dashboard';
  joiningDate = '2020-01-15';
  imageUrl = 'assets/employee (1).png';
  dob = '1990-07-15';
  currentTime = '';
  currentDate = '';
  showProfile = false;
  
  // Employee data
  emp: any = {
    name: 'Shraddha Meshram',
    imageUrl: '',
    empID: 'EMP00123',
    branch: 'Mumbai',
    department: 'HR',
    email: 'shraddha@intellisys.com',
    dateOfBirth: new Date('1990-07-15')
  };

  // Dashboard data
  upcomingBirthdays: any[] = [];
  birthdaysThisMonth: any[] = [];
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  
  // Edit states
  editingWelcome = false;
  editingNews = false;
  editingDocuments = false;
  editingReminders = false;
  editingFeed = false;
  editingEmpDocuments = false;
  editingTodo = false;
  editingJoinee = false;
  editingEmployees = false;

  // Section content
  welcomeMessage = 'Hope you have a great day at work!';
  newsItems: string[] = ['Company picnic next Friday', 'New HR policies released'];
  newsText = '';
  documentSearch = '';
  documents: any[] = [
    { name: 'Company Policy.pdf' },
    { name: 'Employee Handbook.docx' }
  ];
  selectedDocuments: File[] = [];
  reminders: any[] = [
    { title: 'Team meeting', date: '2023-06-15' }
  ];
  feedItems: string[] = ['System maintenance scheduled for tonight', 'New project kickoff meeting tomorrow'];
  feedText = '';
  empDocumentSearch = '';
  empDocuments: any[] = [
    { name: 'Offer Letter.pdf' },
    { name: 'NDA Agreement.docx' }
  ];
  selectedEmpDocuments: File[] = [];
  todoItems: any[] = [
    { task: 'Review quarterly reports', completed: false },
    { task: 'Schedule team building', completed: true }
  ];
  newJoinees: any[] = [
    { 
      name: 'Amit Patel', 
      joinDate: '2023-06-01', 
      imageUrl: 'assets/employee (1).png' 
    }
  ];
  selectedJoineeImages: File[] = [];
  employeeSearch = '';

  // Statistics
  stats = {
    employees: 125,
    present: 118,
    onLeave: 7,
    departments: 8
  };

  // Charts data
  employeeDistribution = {
    labels: ['Sales', 'Marketing', 'HR', 'Development', 'Finance', 'Operations', 'Support', 'R&D'],
    data: [15, 12, 8, 45, 10, 20, 10, 5]
  };

  employeeDistributionData = {
    labels: this.employeeDistribution.labels,
    datasets: [{
      data: this.employeeDistribution.data,
      backgroundColor: [
        '#4a90e2', '#57c87b', '#f4a261', '#a78bfa',
        '#ff6b6b', '#45aaf2', '#fd9644', '#26de81'
      ]
    }]
  };

  attendanceOverview: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [110, 115, 105, 118, 112, 40, 5],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Absent',
        data: [15, 10, 20, 7, 13, 85, 120],
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Employee list
  employeeList = [
    { name: 'Shraddha Meshram', dept: 'Development', title: 'Software Engineer', status: 'Active' },
    { name: 'Rani Sharma', dept: 'Marketing', title: 'Marketing Manager', status: 'Active' },
    { name: 'Ritesh Gupta', dept: 'HR', title: 'HR Specialist', status: 'Inactive' },
    { name: 'Akshay Kumar', dept: 'Sales', title: 'Sales Representative', status: 'Active' }
  ];

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
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const savedData = localStorage.getItem('adminDashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.newsItems = data.newsItems || this.newsItems;
      this.documents = data.documents || this.documents;
      this.reminders = data.reminders || this.reminders;
      this.feedItems = data.feedItems || this.feedItems;
      this.empDocuments = data.empDocuments || this.empDocuments;
      this.todoItems = data.todoItems || this.todoItems;
      this.newJoinees = data.newJoinees || this.newJoinees;
    }
  }

  private saveDashboardData(): void {
    const data = {
      newsItems: this.newsItems,
      documents: this.documents,
      reminders: this.reminders,
      feedItems: this.feedItems,
      empDocuments: this.empDocuments,
      todoItems: this.todoItems,
      newJoinees: this.newJoinees
    };
    localStorage.setItem('adminDashboardData', JSON.stringify(data));
  }

  // Employee management
  get filteredEmployeeList() {
    return this.employeeSearch 
      ? this.employeeList.filter(emp => 
          emp.name.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
          emp.dept.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
          emp.title.toLowerCase().includes(this.employeeSearch.toLowerCase())
        )
      : this.employeeList;
  }

  editEmployee(emp: any): void {
    // In a real app, you would open a modal or form for editing
    console.log('Editing employee:', emp);
  }

  deleteEmployee(emp: any): void {
    if (confirm(`Are you sure you want to delete ${emp.name}?`)) {
      this.employeeList = this.employeeList.filter(e => e !== emp);
    }
  }

  addEmployee(): void {
    this.employeeList.push({ 
      name: 'New Employee', 
      dept: 'Department', 
      title: 'Position', 
      status: 'Active' 
    });
  }

  toggleEmployeeEdit(): void {
    this.editingEmployees = !this.editingEmployees;
  }

  // User profile methods
  private loadUserInfo(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      this.fetchUserProfile();
    }
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
      error: (err) => console.error('Error fetching user profile:', err),
    });
  }

  private getEmployeeDetails(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/employees/profile`, { headers }).subscribe({
      next: (res) => {
        const emp = res?.employee;
        if (!emp) {
          console.warn('No employee data found.');
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
            ? `${this.API_URL}/${emp.image}`
            : 'assets/employee (1).png';
      },
      error: (err) => console.error('Error fetching employee details:', err),
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

  getUpcomingBirthdays() {
    const headers = this.createAuthHeaders();
    this.http.get(`${this.API_URL}/employees/upcoming-birthdays`, { headers }).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.upcomingBirthdays = this.filterUpcomingBirthdays(response.upcomingBirthdays || []);
        }
      },
      error: (err) => {
        console.error('Error fetching upcoming birthdays:', err);
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

  private fetchEmployees(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/employees`, { headers }).subscribe({
      next: (res) => {
        const employees: any[] = res?.employees || [];
        const loggedInEmpID = this.authService.getEmployeeId();
        this.filteredEmployees = employees.filter((emp: any) => emp.empID !== loggedInEmpID);
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }

  // Edit section methods
  toggleEdit(section: string): void {
    switch(section) {
      case 'welcome':
        this.editingWelcome = !this.editingWelcome;
        if (!this.editingWelcome) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('welcomeMessage', this.welcomeMessage);
        }
        break;
      case 'news':
        this.editingNews = !this.editingNews;
        if (!this.editingNews) this.saveDashboardData();
        break;
      case 'documents':
        this.editingDocuments = !this.editingDocuments;
        if (!this.editingDocuments) this.saveDashboardData();
        break;
      case 'reminders':
        this.editingReminders = !this.editingReminders;
        if (!this.editingReminders) this.saveDashboardData();
        break;
      case 'feed':
        this.editingFeed = !this.editingFeed;
        if (!this.editingFeed) this.saveDashboardData();
        break;
      case 'empDocuments':
        this.editingEmpDocuments = !this.editingEmpDocuments;
        if (!this.editingEmpDocuments) this.saveDashboardData();
        break;
      case 'todo':
        this.editingTodo = !this.editingTodo;
        if (!this.editingTodo) this.saveDashboardData();
        break;
      case 'joinee':
        this.editingJoinee = !this.editingJoinee;
        if (!this.editingJoinee) this.saveDashboardData();
        break;
    }
  }

  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.emp.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addNewsItem(): void {
    if (this.newsText.trim()) {
      this.newsItems.push(this.newsText);
      this.newsText = '';
      this.saveDashboardData();
    }
  }

  onDocumentUpload(event: any): void {
    this.selectedDocuments = Array.from(event.target.files);
  }

  uploadDocuments(): void {
    if (this.selectedDocuments.length > 0) {
      this.selectedDocuments.forEach(file => {
        this.documents.push({ name: file.name, file: file });
      });
      this.selectedDocuments = [];
      this.saveDashboardData();
    }
  }

  deleteDocument(doc: any): void {
    this.documents = this.documents.filter(d => d.name !== doc.name);
    this.saveDashboardData();
  }

  addReminder(): void {
    this.reminders.push({ title: 'New reminder', date: new Date().toISOString().split('T')[0] });
  }

  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
  }

  addFeedItem(): void {
    if (this.feedText.trim()) {
      this.feedItems.push(this.feedText);
      this.feedText = '';
      this.saveDashboardData();
    }
  }

  onEmpDocumentUpload(event: any): void {
    this.selectedEmpDocuments = Array.from(event.target.files);
  }

  uploadEmpDocuments(): void {
    if (this.selectedEmpDocuments.length > 0) {
      this.selectedEmpDocuments.forEach(file => {
        this.empDocuments.push({ name: file.name, file: file });
      });
      this.selectedEmpDocuments = [];
      this.saveDashboardData();
    }
  }

  deleteEmpDocument(doc: any): void {
    this.empDocuments = this.empDocuments.filter(d => d.name !== doc.name);
    this.saveDashboardData();
  }

  addTodoItem(): void {
    this.todoItems.push({ task: 'New task', completed: false });
  }

  removeTodoItem(index: number): void {
    this.todoItems.splice(index, 1);
    this.saveDashboardData();
  }

  addJoinee(): void {
    this.newJoinees.push({ 
      name: 'New Employee', 
      joinDate: new Date().toISOString().split('T')[0], 
      imageUrl: 'assets/employee (1).png' 
    });
  }

  removeJoinee(index: number): void {
    this.newJoinees.splice(index, 1);
    this.saveDashboardData();
  }

  onJoineeImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newJoinees[index].imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Filter functions
  get filteredDocuments(): any[] {
    return this.documentSearch 
      ? this.documents.filter(doc => doc.name.toLowerCase().includes(this.documentSearch.toLowerCase()))
      : this.documents;
  }

  get filteredEmpDocuments(): any[] {
    return this.empDocumentSearch 
      ? this.empDocuments.filter(doc => doc.name.toLowerCase().includes(this.empDocumentSearch.toLowerCase()))
      : this.empDocuments;
  }

  // Utility methods
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleProfile(): void {
    this.showProfile = !this.showProfile;
  }

  deleteNewsItem(index: number) {
  this.newsItems.splice(index, 1);
}

deleteFeedItem(index: number) {
  this.feedItems.splice(index, 1);
}
onNotificationClick() {
  // Your logic here: e.g., open a notification panel or redirect
  console.log("Notification icon clicked");
}
onProfileClick() {
  // Your logic here, like navigating to profile page
  console.log("Employee image clicked");
  // Example: this.router.navigate(['/employee-profile']);
}


}


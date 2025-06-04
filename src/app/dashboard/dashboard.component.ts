import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { LeaveService } from '../services/leaves.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private leaveService: LeaveService
  ) {}

  employeeForm!: FormGroup;
  profileData: any;
  pendingLeaves: any[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.loadPendingLeaves();
  }

  buildForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      employeeCode: ['', Validators.required],
      gender: ['', Validators.required],
      location: [''],
      department: [''],
      manager: [''],
      joiningDate: [''],
      salary: ['', Validators.required],
      panNumber: ['', [Validators.required, Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      branch: [''],
      grade: [''],
      designation: [''],
      projectType: [''],
      dateOfBirth: [''],
      epsJoiningDate: [''],
      epsExitDate: [''],
      esicNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      previousMemberId: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/000\/\d{4}$/)]],
      epsNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/000\/\d{4}$/)]]
    });
  }

  submitEmployeeForm(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      console.log('Form submitted:', formData);
      this.profileData = formData;
      this.employeeForm.reset();
    }
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileData = { ...(this.profileData || {}), imageUrl: URL.createObjectURL(file) };
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/adminlogin']);
  }

  loadPendingLeaves(): void {
    this.leaveService.getAllLeaves().subscribe({
      next: (leaves) => {
        this.pendingLeaves = leaves.filter((l: any) => l.status === 'Pending');
      },
      error: (err) => {
        console.error('Error fetching leaves for dashboard:', err);
      }
    });
  }

  approveLeave(id: string): void {
    this.leaveService.approveLeave(id).subscribe(() => this.loadPendingLeaves());
  }

  rejectLeave(id: string): void {
    this.leaveService.rejectLeave(id).subscribe(() => this.loadPendingLeaves());
  }

  stats = {
    employees: 12,
    present: 10,
    onLeave: 2,
    departments: 4
  };

  employeeDistribution = {
    labels: ['Sales', 'Marketing', 'HR', 'Development'],
    data: [4, 4, 3, 8]
  };

  employeeDistributionData = {
    labels: this.employeeDistribution.labels,
    datasets: [{
      data: this.employeeDistribution.data,
      backgroundColor: ['#4a90e2', '#57c87b', '#f4a261', '#a78bfa']
    }]
  };

  attendanceOverview: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thus', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [12, 10, 5, 8, 11, 4, 0],
        borderColor: 'green',
        backgroundColor: 'pink',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Absent',
        data: [0, 2, 0, 3, 0, 6, 12],
        borderColor: 'red',
        backgroundColor: 'pink',
        tension: 0.3,
        fill: false
      }
    ]
  };

  employeeList = [
    { name: 'Shraddha Meshram', dept: 'Development', title: 'Software Engineer', status: 'Active' },
    { name: 'Rani', dept: 'Marketing', title: 'Marketing Manager', status: 'Active' },
    { name: 'Ritesh', dept: 'HR', title: 'HR Specialist', status: 'Inactive' },
    { name: 'Akshay', dept: 'Sales', title: 'Sales Representative', status: 'Active' }
  ];
}

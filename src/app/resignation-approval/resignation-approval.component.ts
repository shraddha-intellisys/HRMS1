import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resignation-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './resignation-approval.component.html',
  styleUrls: ['./resignation-approval.component.css']
})
export class ResignationApprovalComponent {
  resignationRequests = [
    {
      empCode: 'EMP001',
      empName: 'ABC',
      department: 'IT',
      lastWorkingDay: '',
      reason: '',
      expanded: false
    },
    {
      empCode: 'EMP002',
      empName: 'XYZ',
      department: 'HR',
      lastWorkingDay: '',
      reason: '',
      expanded: false
    }
  ];

  // Resignation history section
  activeTab: 'approved' | 'rejected' = 'approved';
  
  approvedResignations = [
    {
      empCode: 'EMP003',
      empName: 'Mike Johnson',
      department: 'Finance',
      lastWorkingDay: new Date('2023-05-15'),
      reason: 'Career change',
      approvedDate: new Date('2023-04-20'),
      status: 'Approved'
    }
  ];

  rejectedResignations = [
    {
      empCode: 'EMP004',
      empName: 'Sarah Williams',
      department: 'Marketing',
      lastWorkingDay: new Date('2023-06-10'),
      reason: 'Personal reasons',
      rejectedDate: new Date('2023-05-28'),
      rejectionReason: 'Counter offer accepted'
    }
  ];

  toggleRequest(index: number) {
    this.resignationRequests[index].expanded = !this.resignationRequests[index].expanded;
  }

  approveResignation(index: number) {
    const request = this.resignationRequests[index];
    const approvedResignation = {
      empCode: request.empCode,
      empName: request.empName,
      department: request.department,
      lastWorkingDay: request.lastWorkingDay ? new Date(request.lastWorkingDay) : new Date(),
      reason: request.reason,
      approvedDate: new Date(),
      status: 'Approved'
    };
    this.approvedResignations.push(approvedResignation);
    this.resignationRequests.splice(index, 1);
    console.log('Resignation approved:', approvedResignation);
  }

  rejectResignation(index: number) {
    const request = this.resignationRequests[index];
    const rejectedResignation = {
      empCode: request.empCode,
      empName: request.empName,
      department: request.department,
      lastWorkingDay: request.lastWorkingDay ? new Date(request.lastWorkingDay) : new Date(),
      reason: request.reason,
      rejectedDate: new Date(),
      rejectionReason: 'Manager rejected'
    };
    this.rejectedResignations.push(rejectedResignation);
    this.resignationRequests.splice(index, 1);
    console.log('Resignation rejected:', rejectedResignation);
  }
}
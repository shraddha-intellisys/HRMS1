import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: string;
  name: string;
  leaveBalance: number;
}

interface LeaveRequest {
  empName: string;
  empId: string;
  expanded: boolean;
  applicationDate: Date;
  applicationType: string;
  leaveType: string;
  leaveBalance: number;
  fromDate: string;
  fromDateHalf: string;
  toDate: string;
  toDateHalf: string;
  reason: string;
  remarks: string;
  ccEmail: string;
  approvedBy: string;
}

interface ApprovedLeave {
  empName: string;
  empId: string;
  leaveType: string;
  fromDate: Date;
  fromDateHalf: string;
  toDate: Date;
  toDateHalf: string;
  approvedDate: Date;
  status: string;
  approvedBy: string;
}

interface RejectedLeave {
  empName: string;
  empId: string;
  leaveType: string;
  fromDate: Date;
  fromDateHalf: string;
  toDate: Date;
  toDateHalf: string;
  rejectedDate: Date;
  rejectionReason: string;
  rejectedBy?: string;
}

@Component({
  selector: 'app-leaves-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './leaves-approval.component.html',
  styleUrls: ['./leaves-approval.component.css']
})
export class LeavesApprovalComponent {
  leaveRequests: LeaveRequest[] = [
    {
      empName: 'ABC',
      empId: 'EMP001',
      expanded: false,
      applicationDate: new Date(),
      applicationType: 'Annual Leave',
      leaveType: 'Full Day',
      leaveBalance: 25,
      fromDate: '',
      fromDateHalf: 'First Half',
      toDate: '',
      toDateHalf: 'First Half',
      reason: '',
      remarks: '',
      ccEmail: '',
      approvedBy: ''
    },
    {
      empName: 'XYZ',
      empId: 'EMP002',
      expanded: false,
      applicationDate: new Date(),
      applicationType: 'Sick Leave',
      leaveType: 'Half Day',
      leaveBalance: 15,
      fromDate: '',
      fromDateHalf: 'First Half',
      toDate: '',
      toDateHalf: 'First Half',
      reason: '',
      remarks: '',
      ccEmail: '',
      approvedBy: ''
    }
  ];

  activeTab: 'approved' | 'rejected' = 'approved';
  approvedLeaves: ApprovedLeave[] = [
    {
      empName: 'John Doe',
      empId: 'EMP001',
      leaveType: 'Annual Leave',
      fromDate: new Date('2023-06-01'),
      fromDateHalf: 'First Half',
      toDate: new Date('2023-06-03'),
      toDateHalf: 'Second Half',
      approvedDate: new Date('2023-05-28'),
      status: 'Approved',
      approvedBy: 'Admin'
    }
  ];

  rejectedLeaves: RejectedLeave[] = [
    {
      empName: 'Mike Johnson',
      empId: 'EMP003',
      leaveType: 'Casual Leave',
      fromDate: new Date('2023-06-15'),
      fromDateHalf: 'First Half',
      toDate: new Date('2023-06-17'),
      toDateHalf: 'Second Half',
      rejectedDate: new Date('2023-06-10'),
      rejectionReason: 'Insufficient leave balance'
    }
  ];

  toggleRequest(index: number) {
    this.leaveRequests[index].expanded = !this.leaveRequests[index].expanded;
  }

  approveLeave(index: number) {
    const request = this.leaveRequests[index];
    const approvedLeave: ApprovedLeave = {
      empName: request.empName,
      empId: request.empId,
      leaveType: request.leaveType,
      fromDate: new Date(request.fromDate),
      fromDateHalf: request.fromDateHalf,
      toDate: new Date(request.toDate),
      toDateHalf: request.toDateHalf,
      approvedDate: new Date(),
      status: 'Approved',
      approvedBy: request.approvedBy
    };
    this.approvedLeaves.push(approvedLeave);
    this.leaveRequests.splice(index, 1);
  }

  rejectLeave(index: number) {
    const request = this.leaveRequests[index];
    const rejectedLeave: RejectedLeave = {
      empName: request.empName,
      empId: request.empId,
      leaveType: request.leaveType,
      fromDate: new Date(request.fromDate),
      fromDateHalf: request.fromDateHalf,
      toDate: new Date(request.toDate),
      toDateHalf: request.toDateHalf,
      rejectedDate: new Date(),
      rejectionReason: 'Manager rejected'
    };
    this.rejectedLeaves.push(rejectedLeave);
    this.leaveRequests.splice(index, 1);
  }

  calculateLeaveDays(leave: ApprovedLeave | RejectedLeave): number {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (leave.fromDateHalf !== leave.toDateHalf && diffDays === 1) {
      return 0.5;
    }
    if (leave.fromDateHalf === 'Second Half' || leave.toDateHalf === 'First Half') {
      return diffDays - 0.5;
    }
    return diffDays;
  }
}
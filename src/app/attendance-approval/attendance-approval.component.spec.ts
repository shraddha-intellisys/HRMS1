import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-approval.component.html',
  styleUrls: ['./attendance-approval.component.css']
})
export class AttendanceApprovalComponent {
  requests = [
    { empName: 'John Doe', empId: 'EMP123', expanded: false },
    { empName: 'Jane Smith', empId: 'EMP456', expanded: false }
  ];

  selectedDate: string = '';
  holidayReason: string = '';
  holidayStatus: string = '';
  showHolidayForm: boolean = false;

  toggleRequest(index: number) {
    this.requests[index].expanded = !this.requests[index].expanded;
  }

  accept(index: number) {
    alert(`Accepted request of ${this.requests[index].empName}`);
  }

  reject(index: number) {
    alert(`Rejected request of ${this.requests[index].empName}`);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.holidayReason = '';
    this.holidayStatus = '';
    this.showHolidayForm = true;
  }

  saveHoliday() {
    alert(`Holiday for ${this.selectedDate} saved:\nReason: ${this.holidayReason}\nStatus: ${this.holidayStatus}`);
    this.showHolidayForm = false;
  }
}

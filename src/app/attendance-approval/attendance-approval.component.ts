import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-attendance-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './attendance-approval.component.html',
  styleUrls: ['./attendance-approval.component.css']
})
export class AttendanceApprovalComponent {
  requests = [
    { empName: 'ABC', empId: 'EMP001', expanded: false },
    { empName: 'XYZ', empId: 'EMP002', expanded: false }
  ];

  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear = this.currentDate.getFullYear();
  calendarDays: any[] = [];
  selectedDate: any = null;
   editingHoliday = false;
  editingHolidayName = '';
  editingHolidayReason = '';


  holidays = [
    { date: new Date('2025-06-15'), name: 'Father\'s Day', reason: 'Celebration of fatherhood', approved: false },
    { date: new Date('2025-07-04'), name: 'Independence Day', reason: 'National holiday', approved: true }
  ];

  constructor() {
    this.generateCalendar();
  }

  toggleRequest(index: number) {
    this.requests[index].expanded = !this.requests[index].expanded;
  }

  accept(index: number) {
    console.log('Accepted request:', this.requests[index]);
  }

  reject(index: number) {
    console.log('Rejected request:', this.requests[index]);
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({});
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const holiday = this.holidays.find(h => 
        h.date.getDate() === currentDate.getDate() &&
        h.date.getMonth() === currentDate.getMonth() &&
        h.date.getFullYear() === currentDate.getFullYear()
      );
      
      this.calendarDays.push({
        date: i,
        fullDate: currentDate,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
        holidayReason: holiday?.reason,
        approved: holiday?.approved
      });
    }
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateCalendarHeaders();
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateCalendarHeaders();
    this.generateCalendar();
  }

  updateCalendarHeaders() {
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
  }

  selectDate(day: any) {
    if (day.date) {
      this.selectedDate = day;
    }
  }

  
  startEditing() {
    this.editingHoliday = true;
    this.editingHolidayName = this.selectedDate.holidayName || '';
    this.editingHolidayReason = this.selectedDate.holidayReason || '';
  }

  saveHoliday() {
    if (this.editingHolidayName.trim()) {
      const holidayIndex = this.holidays.findIndex(h => 
        h.date.getDate() === this.selectedDate.fullDate.getDate() &&
        h.date.getMonth() === this.selectedDate.fullDate.getMonth() &&
        h.date.getFullYear() === this.selectedDate.fullDate.getFullYear()
      );

      const newHoliday = {
        date: new Date(this.selectedDate.fullDate),
        name: this.editingHolidayName,
        reason: this.editingHolidayReason,
        approved: holidayIndex >= 0 ? this.holidays[holidayIndex].approved : false
      };

      if (holidayIndex >= 0) {
        this.holidays[holidayIndex] = newHoliday;
      } else {
        this.holidays.push(newHoliday);
      }

      this.generateCalendar();
      this.editingHoliday = false;
      this.selectDate(this.calendarDays.find(d => 
        d.date === this.selectedDate.date && 
        d.fullDate.getMonth() === this.selectedDate.fullDate.getMonth()
      ));
    }
  }

  cancelEditing() {
    this.editingHoliday = false;
  }

  approveHoliday() {
    const holidayIndex = this.holidays.findIndex(h => 
      h.date.getDate() === this.selectedDate.fullDate.getDate() &&
      h.date.getMonth() === this.selectedDate.fullDate.getMonth() &&
      h.date.getFullYear() === this.selectedDate.fullDate.getFullYear()
    );
    
    if (holidayIndex >= 0) {
      this.holidays[holidayIndex].approved = true;
    }
    
    this.generateCalendar();
    console.log('Holiday approved:', this.selectedDate);
  }

  addHoliday() {
    const holidayName = prompt('Enter holiday name:');
    if (holidayName) {
      const holidayReason = prompt('Enter holiday reason:');
      const newHoliday = {
        date: new Date(this.selectedDate.fullDate),
        name: holidayName,
        reason: holidayReason || '',
        approved: false
      };
      
      this.holidays.push(newHoliday);
      this.generateCalendar();
      console.log('Holiday added:', newHoliday);
    }
  }
}
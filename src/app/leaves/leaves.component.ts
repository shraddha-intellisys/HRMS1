import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AttendanceService } from '../services/attendance.service';
import { LeaveService } from '../services/leaves.service';
import moment from 'moment';

@Component({
  selector: 'app-leaves',
  standalone: true,
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css'],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule
  ]
})
export class LeavesComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;

  constructor(
    private attendanceService: AttendanceService,
    private leavesService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateYearRange();
    this.updateMonthOptions();
    this.viewHolidays();
    this.fetchLeaveApplications();
  }

  ngOnDestroy(): void {}

  holidays: { name: string; date: string }[] = [];

  attendanceSummary = {
    present: 0, absent: 0, leave: 0, lwp: 0,
    leaveSubmit: 0, attendanceSubmit: 0, phy: 0,
    weo: 0, reminders: 0, halfDay: 0, blocked: 0,
  };

  leaves = [
    { name: 'Privileged Leave', total: 0, utilised: 0, balance: 0, pending: 0, encashment: 0, adjustment: 0, net: 0 },
    { name: 'Paternity Leave', total: 0, utilised: 0, balance: 0, pending: 0, encashment: 0, adjustment: 0, net: 0 },
    { name: 'Compensatory Leave', total: 0, utilised: 0, balance: 0, pending: 0, encashment: 0, adjustment: 0, net: 0 }
  ];

  startDate: Date | null = null;
  endDate: Date | null = null;

  years: number[] = [];
  availableMonths: string[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = '';

  allMonths: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  generateYearRange(): void {
    const startYear = 2020;
    const endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  updateMonthOptions(): void {
    const currentMonth = new Date().getMonth();
    this.availableMonths = this.selectedYear === new Date().getFullYear()
      ? this.allMonths.slice(0, currentMonth + 1)
      : [...this.allMonths];
    this.selectedMonth = this.availableMonths[0];
  }

  onYearChange(): void {
    this.updateMonthOptions();
  }

  onMonthChange(): void {}

  resetDateRange(): void {
    this.selectedYear = new Date().getFullYear();
    this.updateMonthOptions();
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventContent: this.renderEventContent.bind(this),
    headerToolbar: {
      left: 'prev,today',
      center: 'title',
      right: 'next'
    },
    dateClick: this.onDateClick.bind(this),
    dayCellDidMount: (info) => {
      info.el.style.cursor = 'pointer';
      if (info.date.getDay() === 6 || info.date.getDay() === 0) {
        info.el.style.backgroundColor = 'white';
        info.el.style.color = '#d9534f';
      }
    }
  };

  renderEventContent(arg: EventContentArg): { html: string } {
    try {
      const data = JSON.parse(arg.event.title);
      return {
        html: `
          <div style="line-height: 1.2; font-size: 0.75rem;">
            ${data.lws ? `<div style="color: blue;">leave Submit</div>` : ''}
          </div>
        `
      };
    } catch {
      return { html: `<div>${arg.event.title}</div>` };
    }
  }

  pendingLeaves: any[] = [];

fetchLeaveApplications(): void {
  this.leavesService.getAllLeaves().subscribe({
    next: (leaveApplications) => {
      this.pendingLeaves = leaveApplications.filter(l => l.status === 'Pending');

      const approvedLeaves = leaveApplications.filter(l => l.status === 'Approved');

      const events: any[] = [];

      approvedLeaves.forEach((leave: any) => {
        const start = moment(leave.fromDate);
        const end = moment(leave.toDate);
        const totalDays = end.diff(start, 'days') + 1;

        for (let i = 0; i < totalDays; i++) {
          const date = start.clone().add(i, 'days').format('YYYY-MM-DD');
          events.push({
            title: JSON.stringify({ lws: 'Submitted Leave' }),
            start: date,
            textColor: 'blue',
            display: 'block'
          });
        }
      });

      
      this.calendarOptions = {
        ...this.calendarOptions,
        events
      };
    },
    error: (err) => {
      console.error('Error fetching leave applications:', err);
    }
  });
}


approveLeave(id: string): void {
  this.leavesService.approveLeave(id).subscribe(() => {
    alert('✅ Leave approved');
    this.fetchLeaveApplications();
  });
}


  onDateClick(event: any): void {
    if (event.dateStr) {
      this.router.navigate(['/leave'], { queryParams: { date: event.dateStr } });
    }
  }

  attendanceDate: string = '2024-09-01';

  cards = [
    { label: 'All Record', count: 0, class: 'all-record' },
    { label: 'Submitted', count: 0, class: 'submitted' },
    { label: 'Accepted', count: 0, class: 'accepted' },
    { label: 'Rejected', count: 0, class: 'rejected' },
    { label: 'Cancelled', count: 0, class: 'cancelled' },
    { label: 'New Application', count: '+', class: 'new-application' }
  ];

  refresh(): void {
    console.log('Refresh clicked. Date:', this.attendanceDate);
    this.fetchLeaveApplications();
  }

  handleCardClick(card: any): void {
    if (card.label === 'New Application') {
      this.router.navigate(['/leave']);
    }
  }

  attendanceSummaryRows = [
    { label: 'Present', count: this.attendanceSummary.present },
    { label: 'Absent', count: this.attendanceSummary.absent },
    { label: 'Leave', count: this.attendanceSummary.leave },
    { label: 'LWP', count: this.attendanceSummary.lwp },
    { label: 'Leave Submit', count: this.attendanceSummary.leaveSubmit },
    { label: 'Attendance Submit', count: this.attendanceSummary.attendanceSubmit },
    { label: 'Phy', count: this.attendanceSummary.phy },
    { label: 'WEO', count: this.attendanceSummary.weo },
    { label: 'Reminders', count: this.attendanceSummary.reminders },
    { label: 'Half Day', count: this.attendanceSummary.halfDay },
    { label: 'Blocked', count: this.attendanceSummary.blocked }
  ];

  submitLeaveApplication(): void {
  if (!this.startDate || !this.endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time

  const from = new Date(this.startDate);
  const to = new Date(this.endDate);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  if (from <= today || to <= today) {
    alert('❌ Leave dates must be after today.');
    return;
  }

  if (from > to) {
    alert('❌ From Date cannot be after To Date.');
    return;
  }

  const leaveApplication = {
    applicationDate: new Date(),
    applicationType: 'Leave Application',
    leaveType: 'Privileged Leave',
    fromDate: this.startDate,
    toDate: this.endDate,
    reason: 'Personal Work',
    remarks: 'NA',
    ccEmail: 'someone@example.com'
  };

  this.leavesService.submitLeave(leaveApplication).subscribe({
    next: (res) => {
      console.log('✅ Leave Submitted:', res);
      alert('✅ Leave application submitted successfully!');
      this.fetchLeaveApplications();
    },
    error: (err) => {
      console.error('❌ Error submitting leave:', err);
      alert('❌ Failed to submit leave.');
    }
  });
}


  viewHolidays(): void {
    this.leavesService.getHolidays().subscribe({
      next: (holidays: any) => {
        this.holidays = holidays;
      },
      error: (err: any) => {
        console.error('Error fetching holidays:', err);
      }
    });
  }
}

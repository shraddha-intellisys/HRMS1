import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { CalendarOptions, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  standalone: true,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    FullCalendarModule
  ]
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  currentDate: string = '';
  currentTime: string = '';
  private timerInterval: any;

  markInTime: string | null = null;
  markOutTime: string | null = null;
  selectedDate: Date = new Date();
  attendanceDate: Date = new Date();
  isChecked: boolean = false;

  employeeCode: string = 'SM123';

  attendanceSummary = {
    present: 0,
    absent: 0,
    leave: 0,
    lwp: 0,
    leaveSubmit: 0,
    attendanceSubmit: 0,
    phy: 0,
    weo: 0,
    reminders: 0,
    halfDay: 0,
    blocked: 0
  };

  roster = {
    shiftName: '',
    shiftTiming: ''
  };

  attendanceByDate: {
    [date: string]: {
      pbm: string; pbmTime?: string; markIn?: string; markOut?: string 
}
  } = {};

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventContent: this.renderEventContent.bind(this),
    dateClick: this.onDateClick.bind(this)
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);
    this.fetchPBMEvents();
  }

  fetchPBMEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/pbm')
      .subscribe({
        next: (events) => {
          const pbmMap = events.reduce((acc, e) => {
            acc[e.applicationDate] = {
              ...acc[e.applicationDate],
              pbmTime: `${e.startTime} - ${e.endTime}`
            };
            return acc;
          }, {} as { [date: string]: any });
  
          for (const date in pbmMap) {
            this.attendanceByDate[date] = {
              ...(this.attendanceByDate[date] || {}),
              pbmTime: pbmMap[date].pbmTime
            };
            this.updateCalendarEvent(date);
          }
        },
        error: (err) => {
          console.error('❌ PBM Fetch Error:', err);
        }
      });
  }
  
  

  updateCalendarPBM(date: string): void {
    const existingEvents = [...(this.calendarOptions.events as any[])];
    const filteredEvents = existingEvents.filter(e => e.date !== date);
  
    filteredEvents.push({
      title: JSON.stringify({ pbm: 'PBM' }),
      date,
      textColor: 'blue',
      display: 'auto'
    });
  
    this.calendarOptions.events = filteredEvents;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }

  onMarkInTime(): void {
    const today = moment().format('YYYY-MM-DD');
    const time = moment().format('hh:mm:ss A');

    this.http.post('http://localhost:5000/api/attendance/mark-in', {
      employeeCode: this.employeeCode
    }).subscribe({
      next: (res: any) => {
        this.markInTime = time;
        this.attendanceByDate[today] = {
          ...(this.attendanceByDate[today] || {}),
          markIn: time
        };
        this.updateCalendarEvent(today);
        console.log('✅ Mark In Success:', res);
      },
      error: err => {
        console.error('❌ Mark In API Error:', err);
      }
    });
  }

  onMarkOutTime(): void {
    const today = moment().format('YYYY-MM-DD');
    const time = moment().format('hh:mm:ss A');

    if (!this.attendanceByDate[today]?.markIn) {
      alert('Please Mark In first.');
      return;
    }

    this.http.post('http://localhost:5000/api/attendance/mark-out', {
      employeeCode: this.employeeCode
    }).subscribe({
      next: (res: any) => {
        this.markOutTime = time;
        this.attendanceByDate[today] = {
          ...(this.attendanceByDate[today] || {}),
          markOut: time
        };
        this.updateCalendarEvent(today);
        console.log('✅ Mark Out Success:', res);
      },
      error: err => {
        console.error('❌ Mark Out API Error:', err);
      }
    });
  }

  updateCalendarEvent(date: string): void {
    const existingEvents = [...(this.calendarOptions.events as any[])];
    const filteredEvents = existingEvents.filter(e => e.date !== date);

    const attendance = this.attendanceByDate[date];
    let textColor: string = 'red';

    if (attendance.markIn && attendance.markOut) {
      const markInMoment = moment(attendance.markIn, 'hh:mm:ss A');
      const markOutMoment = moment(attendance.markOut, 'hh:mm:ss A');
      const diffInSeconds = markOutMoment.diff(markInMoment, 'seconds');
      textColor = diffInSeconds >= 3 ? 'green' : 'red';
    }

    const title = JSON.stringify(attendance);

    filteredEvents.push({
      title,
      date,
      textColor,
      display: 'auto',
      pbm: attendance.pbm ? 'PBM' : undefined
    });

    this.calendarOptions.events = filteredEvents;
  }

  renderEventContent(arg: EventContentArg): { html: string } {
    try {
      const data = JSON.parse(arg.event.title);
      return {
        html: `
          <div style="line-height: 1.2; font-size: 0.75rem;">
            ${data.markIn ? `<div>${data.markIn}</div>` : ''}
            ${data.markOut ? `<div>${data.markOut}</div>` : ''}
            ${data.pbmTime ? `<div style="color: blue;">${data.pbmTime}</div>` : ''}
          </div>
        `
      };
    } catch (e) {
      return { html: `<div>${arg.event.title}</div>` };
    }
  }

  onDateClick(info: any): void {
    const clickedDate = info.dateStr;
    console.log('📅 Date clicked:', clickedDate);
    this.router.navigate(['/attendance-application'], {
      queryParams: { date: clickedDate }
    });
  }

  onDateChange(event: any): void {
    console.log('Date changed:', event.value);
  }

  refresh(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Refreshing data');
    }
  }
}

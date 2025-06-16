import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
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
import { LoginPageComponent } from '../login-page/login-page.component';

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
      pbm: string; pbmTime?: string; markIn?: string; markOut?: string; lws?: string; phy?: string;
    }
  } = {};

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventContent: this.renderEventContent.bind(this),
    dateClick: this.onDateClick.bind(this)
  };
  durationTime: string | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);
    this.fetchPBMEvents();
    this.loadHolidayEvents();
    this.loadAttendanceRecords();
  }

  loadAttendanceRecords(): void {
  this.http.get<any[]>(`http://localhost:5000/api/attendance/all/${this.employeeCode}`)
    .subscribe({
      next: (records) => {
        records.forEach((rec: any) => {
          const date = moment(rec.date).format('YYYY-MM-DD');
          this.attendanceByDate[date] = {
            ...(this.attendanceByDate[date] || {}),
            markIn: rec.markIn,
            markOut: rec.markOut,
            ...(rec.lateMark ? { lateMark: 'Late Mark' } : {})
          };
          this.updateCalendarEvent(date);
        });
      },
      error: (err) => {
        console.error('❌ Attendance fetch error:', err);
      }
    });
}


  fetchPBMEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/pbm')
      .subscribe({
        next: (events) => {
          const pbmMap = events.reduce((acc, e) => {
            acc[e.applicationDate] = {
              ...acc[e.applicationDate],
              pbmTime: `${e.startTime} - ${e.endTime}`,
              phy: 'PHY'
            };
            return acc;
          }, {} as { [date: string]: any });

          for (const date in pbmMap) {
            this.attendanceByDate[date] = {
              ...(this.attendanceByDate[date] || {}),
              pbmTime: pbmMap[date].pbmTime,
               phy: pbmMap[date].phy
            };
            this.updateCalendarEvent(date);
          }
        },
        error: (err) => {
          console.error('❌ PBM Fetch Error:', err);
        }
      });
  }

holidays: { date: Date, name: string }[] = [
    { date: new Date('2025-03-08'), name: 'International Women\'s Day' },
    { date: new Date('2025-03-29'), name: 'Good Friday' },
    { date: new Date('2025-04-14'), name: 'Tamil New Year' },
    { date: new Date('2025-04-21'), name: 'Ram Navami' },
    { date: new Date('2025-05-01'), name: 'Labour Day' },
    { date: new Date('2025-08-15'), name: 'Independence Day' },
    { date: new Date('2025-10-02'), name: 'Gandhi Jayanti' },
    { date: new Date('2025-11-01'), name: 'Diwali' },
    { date: new Date('2025-12-25'), name: 'Christmas' },
    { date: new Date('2025-04-09'), name: 'Shraddha bday'}
  ];

loadHolidayEvents(): void {
  const holidayEvents = this.holidays.map(holiday => ({
    title: JSON.stringify({ holiday: holiday.name }),
    date: holiday.date,
    textColor: '#ff4d4d',
    display: 'block'
  }));

  this.calendarOptions = {
    ...this.calendarOptions,
    events: [...(this.calendarOptions.events as any[]), ...holidayEvents]
  };

  console.log('✅ Holidays pushed to calendar:', holidayEvents);
}



  updateCalendarPBM(date: string): void {
    const existingEvents = [...(this.calendarOptions.events as any[])];
    const filteredEvents = existingEvents.filter(e => e.date !== date);

    filteredEvents.push({
      title: JSON.stringify({ pbm: 'PBM' }),
      date,
      textColor: 'red',
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

  const markInMoment = moment(time, 'hh:mm:ss A');
  const lateThreshold = moment('09:30:00 AM', 'hh:mm:ss A');

  const isLate = markInMoment.isAfter(lateThreshold);

  this.http.post('http://localhost:5000/api/attendance/mark-in', {
    employeeCode: this.employeeCode
  }).subscribe({
    next: (res: any) => {
      this.markInTime = time;
      this.attendanceByDate[today] = {
        ...(this.attendanceByDate[today] || {}),
        markIn: time,
        ...(isLate ? { lateMark: 'Late Mark' } : {})
      };
      localStorage.setItem('attendanceByDate', JSON.stringify(this.attendanceByDate));

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

this.durationTime = moment.utc(
        moment(time, 'hh:mm:ss A').diff(moment(this.markInTime, 'hh:mm:ss A'))
      ).format('HH:mm:ss');

        this.attendanceByDate[today] = {
          ...(this.attendanceByDate[today] || {}),
          markOut: time
        };
        localStorage.setItem('attendanceByDate', JSON.stringify(this.attendanceByDate));

        this.updateCalendarEvent(today);
        console.log('✅ Mark Out Success:', res);
      },
      error: err => {
        console.error('❌ Mark Out API Error:', err);
      }
    });
  }

  updateCalendarEvent(date: string): void {
    const attendance = this.attendanceByDate[date];
    const existingEvents = [...(this.calendarOptions.events as any[])];
    const filteredEvents = existingEvents.filter(e => e.date !== date);

    let textColor = 'red';

    if (attendance.markIn && attendance.markOut) {
      const markInMoment = moment(attendance.markIn, 'hh:mm:ss A');
      const markOutMoment = moment(attendance.markOut, 'hh:mm:ss A');
      const diffInSeconds = markOutMoment.diff(markInMoment, 'seconds');
      textColor = diffInSeconds >= 3 ? 'green' : 'red';
    } else if (attendance.lws) {
      textColor = 'blue';
    }

    const title = JSON.stringify(attendance);

    filteredEvents.push({
      title,
      date,
      textColor,
      display: 'block'  // ✅ required for visible rendering
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: filteredEvents
    };

    console.log('✅ Event pushed for:', date, title);
  }


  renderEventContent(arg: EventContentArg): { html: string } {
    try {
      const data = JSON.parse(arg.event.title);
      return {
        html: `
        <div style="line-height: 1.2; font-size: 0.75rem;">
          ${data.markIn ? `<div>${data.markIn}</div>` : ''}
          ${data.markOut ? `<div>${data.markOut}</div>` : ''}
          ${data.pbmTime ? `<div style="color: orange;">${data.pbmTime}</div>` : ''}
          ${data.phy ? `<div style="color: gray; font-weight: bold;">${data.phy}</div>` : ''}
           ${data.holiday ? `<div style="color:rgb(238, 15, 171); font-weight: bold;">${data.holiday}</div>` : ''}
           ${data.lateMark ? `<div style="color: red; font-weight: bold;">${data.lateMark}</div>` : ''}

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


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AttendanceService } from '../services/attendance.service'; 
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-attendance-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance-application.component.html',
  styleUrls: ['./attendance-application.component.css']
})
export class AttendanceApplicationComponent implements OnInit {
  attendanceForm: FormGroup;
  employeeName: string = 'Shraddha';
  employeeCode: string = 'SM123';
  isSubmitting: boolean = false;
  isTimeBasisSelected: boolean = false;
  isDayBasisSelected: boolean = true;

  
  attendanceData = [
    {
      date: new Date(),
      roster: 'Morning',
      muster: 'Present',
      inTime: '09:00 AM',
      outTime: '06:00 PM',
      otHours: '1',
      totalHours: '9',
      lateMarks: '0',
      lateHours: '00:00',
      departureMark: 'On Time',
      departureHours: '0'
    }
  ];
  attendanceApplicationService: any;
  onDateClick(event: any): void {
    const selectedDate = event.dateStr; 
    console.log('📅 Date clicked:', selectedDate);
    this.submitAttendance(selectedDate);
  
  
    const newEvent = {
      applicationDate: selectedDate,
      status: 'Manually Updated', 
    };
    this.updateCalendar([newEvent]);
  }
  
  submitAttendance(selectedDate: any) {
    this.http.post('http://localhost:5000/api/attendance-application', { 
      employeeCode: this.employeeCode, 
      applicationDate: selectedDate 
    }).subscribe(
      (response) => {
        console.log('Attendance Submitted:', response);
      },
      (error) => {
        console.error('Error submitting attendance:', error);
      }
    );
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.fb.group({
      applicationDate: [new Date().toISOString().substring(0, 10), Validators.required], // Today's date
      applicationType: ['casual', Validators.required],
      leaveType: ['full', Validators.required],
      reason: ['Test Reason', Validators.required],
      remarks: ['Testing...'],
      ccTo: ['', [Validators.email]],
      attendanceBasis: ['day', Validators.required],
      startTime: [''],
      endTime: [''],
      fromDate: [new Date().toISOString().substring(0, 10)],
      toDate: [new Date().toISOString().substring(0, 10)],
      fromHalf: [true],
      firstHalf: [true],
      secondHalf: [true],
    });
  }

  ngOnInit(): void {
    this.onBasisChange(this.attendanceForm.get('attendanceBasis')?.value);
  }

  onBasisChange(basis: string): void {
    this.isTimeBasisSelected = basis === 'time';
    this.isDayBasisSelected = basis === 'day';

    if (this.isTimeBasisSelected) {
      this.attendanceForm.get('startTime')?.setValidators([Validators.required]);
    this.attendanceForm.get('endTime')?.setValidators([Validators.required]);
    this.attendanceForm.get('fromDate')?.clearValidators();
    this.attendanceForm.get('toDate')?.clearValidators();
      this.attendanceForm.get('fromHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('firstHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('secondHalf')?.setValidators([Validators.requiredTrue]);
    } else {
      this.attendanceForm.get('startTime')?.clearValidators();
    this.attendanceForm.get('endTime')?.clearValidators();
    this.attendanceForm.get('fromDate')?.setValidators([Validators.required]);
    this.attendanceForm.get('toDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('fromDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('toDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('fromHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('firstHalf')?.setValidators([Validators.requiredTrue]);
      this.attendanceForm.get('secondHalf')?.setValidators([Validators.requiredTrue]);
    }

    this.updateValidations();
  }

  private updateValidations(): void {
    const fields = ['startTime', 'endTime', 'fromDate', 'toDate', 'fromHalf', 'firstHalf', 'secondHalf'];
    fields.forEach(field => this.attendanceForm.get(field)?.updateValueAndValidity());
  }

  onSubmit() {
    if (this.attendanceForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }
  
    const applicationData = {
      employeeName: this.employeeName,
      employeeCode: this.employeeCode,
      ...this.attendanceForm.value
    };
  
    this.http.post('http://localhost:5000/api/attendance-application', applicationData)
      .subscribe({
        next: (res) => {
          console.log('Application submitted successfully:', res);
          alert('Application submitted successfully');
        },
        error: (err) => {
          console.error('Error submitting application:', err);
          alert('Error submitting application');
        }
      });
  }
  
  


  onCancel(): void {
    if (this.attendanceForm.invalid) {
      alert('❌ Cannot cancel: form is invalid.');
      return;
    }
  
    const payload = {
      employeeName: this.employeeName,
      employeeCode: this.employeeCode,
      ...this.attendanceForm.value
    };
  
    this.http.post('http://localhost:5000/api/attendance-application/cancel', payload)
      .subscribe({
        next: (res) => {
          console.log('✅ Application Canceled Successfully:', res);
          alert('✅ Attendance Application Canceled Successfully!');
          this.attendanceForm.reset({
            applicationType: 'casual',
            leaveType: 'full',
            attendanceBasis: 'day'
          });
          this.onBasisChange('day');
        },
        error: (err) => {
          console.error('❌ Error cancelling application:', err);
          alert('❌ Failed to cancel attendance application.');
        }
      });
  }
  


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,today,prevYear',
      center: 'title',
      right: 'nextYear,dayGridMonth,timeGridWeek,next',
    },
    height: 500,
    contentHeight: 'auto',
    aspectRatio: 1.5,
    events: [],  
    dateClick: this.onDateClick.bind(this), 
  };
  
  fetchUpdatedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/attendance-events')  
      .subscribe({
        next: (events: any[]) => {
          console.log('✅ Fetched Updated Events:', events);
          this.updateCalendar(events);  
        },
        error: (err: any) => {
          console.error('❌ Error fetching events:', err);
        }
      });
  }
  
  
  updateCalendar(events: any[]): void {
  const updatedEvents = events.map(event => ({
    title: event.status || 'Manually Updated',  
    start: event.applicationDate,  
    backgroundColor: '#FF5722',  
    display: 'auto',  
  }));

  // Update the calendar's events
  this.calendarOptions = {
    ...this.calendarOptions,  
    events: updatedEvents,    
  };
}


}  

  
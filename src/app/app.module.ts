import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
// import { ScheduleComponent } from './app/schedule/schedule.component'; 

// Custom Routing Module (if needed)
// import { AppRoutingModule } from '../app-routing/app-routing.module';
// import { ScheduleComponent } from '../schedule/schedule.component';

// Import the calendar component (you'll build this)
// import {  ScheduleComponent } from './Schedule.component';

@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    ScheduleComponent,
  ],
  
  
})
export class AttendanceModule {}
export class AppModule {}
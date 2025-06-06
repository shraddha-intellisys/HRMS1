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
import { ResignationComponent } from './resignation/resignation.component';
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';



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
    ResignationComponent,
    AdminLoginComponent,
    DashboardComponent,
    NgChartsModule,
  ],
  
  
})
export class AttendanceModule {}
export class AppModule {}
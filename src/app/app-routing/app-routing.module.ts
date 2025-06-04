import { NgModule } from '@angular/core';
import { AdminLoginComponent } from '../adminlogin/adminlogin.component';
import { RouterModule, Routes } from '@angular/router';

// ✅ Correct imports for Standalone Components
import { AttendanceApplicationComponent } from '../attendance-application/attendance-application.component';
import { LeaveComponent } from '../leave/leave.component';
import { LeavesComponent } from '../leaves/leaves.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ProfileComponent } from '../profile/profile.component';
import { RightComponent } from '../right/right.component';
import { ScheduleComponent } from '../schedule/schedule.component'; // ✅ Correct spelling
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { EmployeeComponent } from '../employee/employee.component';
import { Holiday } from '../holiday/holiday.component';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
   {path: '', component: AdminLoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'right', component: RightComponent },
  { path: 'shedule', component: ScheduleComponent }, // ✅ Correct path for Schedule
  { path: 'leave', component: LeaveComponent },
  { path: 'topnav', component: TopNavComponent },
  { path: 'leaves', component: LeavesComponent },
  { path: 'attendance-application', component: AttendanceApplicationComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'holiday', component: Holiday },
  {
    path: 'adminlogin',
    loadComponent: () => import('../adminlogin/adminlogin.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'adminlogin', pathMatch: 'full' },
  { path: 'admin-dashboard', component: DashboardComponent },
{ path: 'user-dashboard', component: DashboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

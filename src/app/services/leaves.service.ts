import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/leave/all');
  }

  submitLeave(leaveData: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/leave/submit', leaveData);
  }

  getHolidays(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/holidays');
  }

  approveLeave(id: string): Observable<any> {
    return this.http.patch(`http://localhost:5000/api/leave/approve/${id}`, {});
  }

  rejectLeave(id: string): Observable<any> {
    return this.http.patch(`http://localhost:5000/api/leave/reject/${id}`, {});
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/admin/stats');
  }

  getDashboardCharts(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/admin/chart-data');
  }
}

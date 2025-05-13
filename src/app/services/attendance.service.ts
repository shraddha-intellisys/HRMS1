import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ✅ Fetch attendance by employeeCode
  getAttendanceByEmployee(employeeCode: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance/${employeeCode}`);
  }

  // Optional: Fetch with date range
  getAttendanceByDateRange(employeeCode: string, startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance/${employeeCode}?startDate=${startDate}&endDate=${endDate}`);
  }
}

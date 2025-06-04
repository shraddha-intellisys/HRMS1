import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Employee {
  _id?: string;
  name: string;
  email: string;
  employeeCode: string;
  location?: string;
  department: string;
  manager?: string;
  joiningDate: string;
  salary: number;
  panNumber?: string;
  aadharNumber?: string;
  branch?: string;
  grade?: string;
  designation?: string;
  projectType?: string;
  imageUrl?: string;
  dateOfBirth: string;
  epsJoiningDate?: string;
  epsExitDate?: string;
  esicNumber?: string;
  prvMemberID?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeList = new BehaviorSubject<Employee[]>([]);
  employeeList$ = this.employeeList.asObservable();

  private employeeProfile = new BehaviorSubject<Employee | null>(null);
  employeeProfile$ = this.employeeProfile.asObservable();

  private baseUrl = 'http://localhost:5000/api/employees'; // 🔗 Make sure this matches your backend route

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    if (!token) {
      console.warn("⚠️ No token available.");
      return null;
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // ✅ Admin: Fetch all employees
  updateEmployeeList(): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.get<Employee[]>(`${this.baseUrl}/all`, { headers })
      .subscribe({
        next: (employees) => {
          console.log("✅ All Employees Fetched:", employees);
          this.employeeList.next(employees);
        },
        error: (error: any) => {
          console.error("❌ Error fetching employee list:", error);
        }
      });
  }

  // ✅ Fetch profile of logged-in user using employeeId from localStorage
  getEmployeeProfile(): void {
    const headers = this.getAuthHeaders();
    if (!headers) {
      console.warn("⚠️ Missing auth headers");
      return;
    }

    this.http.get<{ employee: Employee }>(`${this.baseUrl}/profile`, { headers })
      .subscribe({
        next: (response) => {
          if (response?.employee) {
            console.log("✅ Employee Profile Received:", response.employee);
            this.employeeProfile.next(response.employee);
            localStorage.setItem('profileData', JSON.stringify(response.employee));
          } else {
            console.warn("⚠️ No employee data found in response.");
          }
        },
        error: (error: any) => {
          console.error("❌ Error fetching employee profile:", error);
        }
      });
  }

  // ✅ Observable version
  getEmployeeProfile$(): Observable<Employee | null> {
    return this.employeeProfile$;
  }

  // ✅ Optional: Get profile only once with query param
  getMyProfile(): Observable<{ employee: Employee }> {
    const headers = this.getAuthHeaders();
    const employeeId = localStorage.getItem('employeeId');
    if (!headers || !employeeId) return of({ employee: null as any });
    return this.http.get<{ employee: Employee }>(`${this.baseUrl}/profile?employeeId=${employeeId}`, { headers });
  }

  // ✅ Add a new employee (only once per user)
  addEmployee(employeeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return of(null as any);

    // ✅ Fixed route to match backend
   return this.http.post(`${this.baseUrl}/add`, employeeData, { headers });

  }

  // ✅ Update existing employee profile
  updateEmployee(id: string, data: any): Observable<Employee> {
  const headers = this.getAuthHeaders();
  if (!headers) return of({} as Employee);
  return this.http.put<Employee>(`${this.baseUrl}/update/${id}`, data, { headers });
}

  getProfile() {
    return this.http.get('/api/employee/profile'); // adjust endpoint if needed
  }
  
  getUpcomingBirthdays(): Observable<Employee[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of([]); // Return an empty array if no token is available
    }
    return this.http.get<Employee[]>(`${this.baseUrl}/upcoming-birthdays`, { headers });
  }
  

  // ✅ Clear profile (on logout)
  clearProfileCache(): void {
    this.employeeProfile.next(null);
    localStorage.removeItem('profileData');
    localStorage.removeItem('employeeId');
  }

  
}

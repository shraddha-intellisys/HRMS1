import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

interface AuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  employeeId?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // ✅ Your backend URL

  constructor(private http: HttpClient) {}

  // ✅ User Signup
  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap((response: AuthResponse) => {
        if (response?.success) {
          console.log('✅ Signup successful');
        } else {
          console.error('❌ Signup failed:', response.message);
        }
      }),
      catchError((error) => {
        console.error('❌ Signup Error:', error);
        return throwError(() => new Error('Signup failed. Please try again.'));
      })
    );
  }

  // ✅ User Login
  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response?.success && response?.token && response?.userId && response?.employeeId) {
          localStorage.clear();
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('employeeId', response.employeeId);
          console.log('✅ Login successful. Data saved to Local Storage:', {
            employeeId: response.employeeId,
            userId: response.userId
          });
        } else {
          console.error('❌ Login failed: Incomplete response from server', response);
          throw new Error('Login failed: Incomplete response');
        }
      }),
      catchError((error) => {
        console.error('❌ Login Error:', error);
        return throwError(() => new Error('Invalid username or password.'));
      })
    );
  }

  // ✅ Get Token from Local Storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Get Logged-in User ID from Local Storage
getUserId(): string | null {
  return localStorage.getItem('userId');
}

  
  

  // ✅ Decode JWT Token (with error handling)
  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
      return null;
    }
  }

  // ✅ Get Logged-in Employee ID from Local Storage
  getEmployeeId(): string | null {
    return localStorage.getItem('employeeId');
  }
  

  // ✅ Check if Token is Expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expiryTime = decoded.exp * 1000; // convert seconds to milliseconds
    return Date.now() > expiryTime;
  }

  // ✅ Check if User is Logged In
  isLoggedIn(): boolean {
    return !!(this.getToken() && this.getEmployeeId() && !this.isTokenExpired());
  }
  

  // ✅ Logout and clear storage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('profileData');
    console.log('👋 User logged out. Local storage cleared.');
  }
}

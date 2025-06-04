import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResignationService {
  private apiUrl = 'http://localhost:5000/api/resignation';

  constructor(private http: HttpClient) {}

  submitForm(data: any) {
    return this.http.post(this.apiUrl, data);
  }
}

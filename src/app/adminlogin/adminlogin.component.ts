import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css'],
  imports: [CommonModule, FormsModule] // ✅ This is what fixes the error
})
export class AdminLoginComponent {
  form = { username: 'SHRADDHA', password: 'Shraddha@123' };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.form).subscribe({
      next: () => {
        if (this.auth.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid token or expired session';
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Login failed';
      }
    });
  }
}

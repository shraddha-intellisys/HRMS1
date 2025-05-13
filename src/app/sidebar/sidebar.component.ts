import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for standalone components
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,  // Indicates this is a standalone component
  imports: [CommonModule,RouterModule],  // Import CommonModule for built-in Angular features like ngIf, ngFor, etc.
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isDropdownOpen = {
    home: false,
    profile: false,
    payroll: false
  };
 

  toggleDropdown(section: keyof typeof this.isDropdownOpen): void {
    this.isDropdownOpen[section] = !this.isDropdownOpen[section];
  }
}

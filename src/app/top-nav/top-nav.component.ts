
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  imports:[CommonModule,RouterModule],
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {
  isMenuOpen = false;

  // Toggle sidebar menu visibility


  isDropdownOpen = {
    home: false,
    profile: false,
    payroll: false
  };

  toggleMenu() {
    console.log('Hamburger menu clicked');
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(section: keyof typeof this.isDropdownOpen): void {
    console.log(`Toggling dropdown for section: ${section}`);
    this.isDropdownOpen[section] = !this.isDropdownOpen[section];
    console.log(this.isDropdownOpen);
  }
}

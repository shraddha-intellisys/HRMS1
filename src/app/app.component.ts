import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterModule, SidebarComponent, TopNavComponent, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'My Angular App'; 
  shouldShowComponents: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Determine if the current route is 'login' or 'signup'
        const currentRoute = this.router.url;
        this.shouldShowComponents =
          !currentRoute.includes('/login') && !currentRoute.includes('/signup');
      });
  }
}

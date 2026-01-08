import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-dashboard-section',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarDashboardSection {
  @Input() username: string = 'John Doe';
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() homeEvent = new EventEmitter<void>();

  logout() {
    this.logoutEvent.emit();
  }

  goToHome() {
    this.homeEvent.emit();
  }
}

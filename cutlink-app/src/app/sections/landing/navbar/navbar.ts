import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar-section',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavBarSection {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = false;

  login() {
    this.authService.login();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

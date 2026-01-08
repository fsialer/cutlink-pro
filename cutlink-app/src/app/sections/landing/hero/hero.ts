import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroSection {
  private router = inject(Router);
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}

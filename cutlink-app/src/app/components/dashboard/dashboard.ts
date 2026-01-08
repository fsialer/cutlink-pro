import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from '../../services/link.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styles: []
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private linkService = inject(LinkService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  createlinkForm: FormGroup = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
    expiration: ['0']
  });

  username: string = '';
  links: any[] = [];
  isLoadingLinks: boolean = false;
  isCreating: boolean = false;
  totalClicks: number = 0;
  totalLinksActive: number = 0;
  showDeleteModal: boolean = false;
  linkToDeleteId: number | null = null;

  async ngOnInit() {
    try {
      const loggedIn = await this.authService.isLoggedIn();
      if (loggedIn) {
        const profile = this.authService.profile();
        this.zone.run(() => {
          this.username = profile.firstName || profile.username || 'User';
          this.cdr.detectChanges();
        });

        // Load links only after we are confirmed to be logged in
        this.loadLinks();
      } else {
        this.zone.run(() => {
          this.username = 'User';
          this.cdr.detectChanges();
        });
      }
    } catch (error) {
      console.error('Error during Dashboard initialization:', error);
      this.zone.run(() => {
        this.username = 'User';
        this.cdr.detectChanges();
      });
    }
  }

  get urlToShorten() {
    return this.createlinkForm.get('url')?.value;
  }

  loadLinks() {
    console.time('fetchLinks');
    this.isLoadingLinks = true;
    this.cdr.detectChanges(); // Update UI to show loading state

    this.linkService.getUserLinks().subscribe({
      next: (data) => {
        this.zone.run(() => {
          if (Array.isArray(data)) {
            this.links = data;
            this.totalClicks = this.links.reduce((acc, link) => acc + (link.clicks || 0), 0);
            this.totalLinksActive = this.links.reduce((acc, link) => acc + (link.expires_at > new Date().toISOString() || 0), 0);
          } else {
            this.links = [];
            this.totalClicks = 0;
          }

          this.isLoadingLinks = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.timeEnd('fetchLinks');
          console.error('Error loading links:', err);
          this.isLoadingLinks = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  createLink() {
    if (this.createlinkForm.invalid) return;

    this.isCreating = true;
    this.cdr.detectChanges();
    const url = this.createlinkForm.get('url')?.value;
    const expirationHours = parseInt(this.createlinkForm.get('expiration')?.value || '0');

    this.linkService.shortenUrl(url, expirationHours).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.createlinkForm.reset();
          this.loadLinks();
          this.isCreating = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Error creating link:', err);
          this.isCreating = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getShortUrl(code: string) {
    return `${window.location.origin}/r/${code}`;
  }

  copyToClipboard(code: string) {
    const url = this.getShortUrl(code);
    navigator.clipboard.writeText(url);
  }

  deleteLink(urlId: number) {
    this.linkToDeleteId = urlId;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.linkToDeleteId = null;
  }

  confirmDelete() {
    if (this.linkToDeleteId !== null) {
      this.linkService.deleteLink(this.linkToDeleteId).subscribe({
        next: () => {
          this.loadLinks();
          this.cancelDelete();
        },
        error: (err) => {
          console.error('Error deleting link:', err);
          this.cancelDelete();
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  isExpired(expiresAt: string): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  isExpiringSoon(expiresAt: string): boolean {
    if (!expiresAt) return false;
    const expiration = new Date(expiresAt);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    return expiration > now && expiration <= threeDaysFromNow;
  }
}

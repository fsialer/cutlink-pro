import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import { NavbarDashboardSection } from '../../sections/dashboard/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LinkService } from '../../services/link.service';
import { ListLinkDashboardSection } from '../../sections/dashboard/list-link/list-link';
import { FormLinkDashboardSection } from '../../sections/dashboard/form-link/form-link';
import { StatsDashBoardSection } from '../../sections/dashboard/stats/stats';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, ReactiveFormsModule, NavbarDashboardSection, FormLinkDashboardSection, StatsDashBoardSection, ListLinkDashboardSection],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private linkService = inject(LinkService);
  isLoadingLinks = signal<boolean>(false);
  //links: any[] = [];
  links = signal<any[]>([]);
  totalLinks: number = 0;
  totalClicks: number = 0;
  totalLinksActive: number = 0;
  totalLinksExpired: number = 0;
  isCreating: boolean = false;
  showDeleteModal: boolean = false;
  username: string = 'User';
  socket: any;

  ngOnInit() {
    try {
      const loggedIn = this.authService.isLoggedIn();
      if (loggedIn) {
        const profile = this.authService.profile();
        this.zone.run(() => {
          this.username = profile.firstName || profile.username || 'User';
        });
        this.loadLinks();
        // Conectar WebSocket
        this.socket = io('http://localhost:4000', {
          path: '/socket.io',
          transports: ['websocket'], // <--- ESTO ES VITAL: Solo usa WebSockets
          upgrade: false,             // No intentes subir de nivel, empieza directamente en WS
          query: { owner_id: '1122b955-179c-44c8-9cd2-c4fcec8f2a73' }, // tu owner_id real
          auth: {
            token: this.authService.token
          }
        });

        // Escuchar eventos
        this.socket.on('click-update', (data: any) => {
          if (this.links()) {
            this.links.set(this.links().map((link: any) => {
              if (link.short_code === data.short_code) {
                link.clicks = data.clicks;
              }
              return link;
            }))
          }
        });
      } else {
        this.zone.run(() => {
          this.username = 'User';
        });
      }
    } catch (error) {
      console.error('Error during Dashboard initialization:', error);
      this.zone.run(() => {
        this.username = 'User';
      });
    }
  }

  deleteLink(urlId: number) {
    this.linkService.deleteLink(urlId).subscribe({
      next: () => {
        this.loadLinks();
      },
      error: (err) => {
        console.error('Error deleting link:', err);
      }
    });
  }


  confirmDelete(urlId: number | null) {
    if (urlId !== null) {
      this.linkService.deleteLink(urlId).subscribe({
        next: () => {
          this.loadLinks();
        },
        error: (err) => {
          console.error('Error deleting link:', err);
        }
      });
    }
  }

  loadLinks() {
    this.isLoadingLinks.set(true);
    this.linkService.getUserLinks().subscribe({
      next: (data) => {
        this.zone.run(() => {
          if (Array.isArray(data)) {
            this.links.set(data);
            this.totalLinks = this.links().length;
            this.totalClicks = this.links().reduce((acc, link) => acc + (link.clicks || 0), 0);
            this.totalLinksActive = this.links().reduce((acc, link) => acc + (link.expires_at > new Date().toISOString() || 0), 0);
            this.totalLinksExpired = this.links().reduce((acc, link) => acc + (link.expires_at < new Date().toISOString() || 0), 0);
          } else {
            this.links.set([])
            this.totalClicks = 0;
            this.totalLinks = 0;
            this.totalLinksActive = 0;
            this.totalLinksExpired = 0;
          }
          this.isLoadingLinks.set(false);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Error loading links:', err);
          this.isLoadingLinks.set(false)
        });
      }
    });
  }



  logout() {
    this.authService.logout();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  createLink(createlinkForm: FormGroup) {

    this.isCreating = true;
    const url = createlinkForm.get('url')?.value;
    const expirationHours = parseInt(createlinkForm.get('expiration')?.value || '0');

    this.linkService.shortenUrl(url, expirationHours).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.loadLinks();
          this.isCreating = false;
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Error creating link:', err);
          this.isCreating = false;
        });
      }
    });
  }
}

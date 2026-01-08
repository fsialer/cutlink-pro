import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingRedirectSection } from '../../sections/redirect/loading/loading';
import { ActivatedRoute } from '@angular/router';
import { ErrorRedirectSection } from '../../sections/redirect/error/error';
import { LinkService } from '../../services/link.service';

@Component({
  selector: 'app-redirect-page',
  standalone: true,
  imports: [LoadingRedirectSection, ErrorRedirectSection],
  templateUrl: './redirect.html',
  styleUrl: './redirect.css',
})
export class RedirectPage implements OnInit {
  private route = inject(ActivatedRoute);
  private linkService = inject(LinkService);
  code: string = '';
  error = signal<string | null>(null);

  setError(msg: string | null) {
    this.error.set(msg)
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code') || '';
    if (this.code) {
      this.fetchAndRedirect();
    } else {
      this.setError('No code provided in the URL.')
    }
  }

  fetchAndRedirect() {
    this.linkService.getOriginalUrl(this.code).subscribe({
      next: (data) => {
        if (data.long_url) {
          this.linkService.incrementClick(this.code).subscribe({
            complete: () => {
              setTimeout(() => {
                window.location.href = data.long_url;
              }, 2000);
            },
            error: (err) => {
              console.error('Failed to increment click count', err);
              this.setError('Failed to increment click count. Please try again.')
            }
          });
        } else {
          this.setError('The requested URL could not be found.')
        }
      },
      error: (err) => {
        if (err.error?.message === 'URL has expired') {
          this.setError('This link has expired and is no longer available.')
        } else if (err.error?.message === 'URL not found') {
          this.setError('This link does not exist or has been deleted.')
        } else {
          this.setError('Failed to retrieve the original URL. Please check the code.')
        }
        console.error('Redirection error:', err)
      }
    });
  }
  retry() {
    this.setError(null);
    this.fetchAndRedirect();
  }
}

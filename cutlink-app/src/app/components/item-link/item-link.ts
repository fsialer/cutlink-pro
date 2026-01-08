import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-link-component',
  imports: [CommonModule],
  templateUrl: './item-link.html',
  styleUrl: './item-link.css',
})
export class ItemLinkComponent {
  @Input() link: any;
  @Output() deleteLinkEvent = new EventEmitter<number>()

  deleteLink(urlId: number) {
    this.deleteLinkEvent.emit(urlId)
  }

  getShortUrl(code: string) {
    return `${window.location.origin}/r/${code}`
  }

  copyToClipboard(code: string) {
    const url = this.getShortUrl(code);
    navigator.clipboard.writeText(url);
  }

  isExpiringSoon(expiresAt: string): boolean {
    if (!expiresAt) return false;
    const expiration = new Date(expiresAt);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    return expiration > now && expiration <= threeDaysFromNow;
  }

  isExpired(expiresAt: string): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }


}

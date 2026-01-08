import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-redirect-section',
  imports: [],
  standalone: true,
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class ErrorRedirectSection {
  @Input() error: string | null = null;
  @Output() retryEvent = new EventEmitter<void>();

  retry() {
    this.retryEvent.emit();
  }

}

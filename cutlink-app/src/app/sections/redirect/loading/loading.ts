import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-redirect-section',
  imports: [],
  standalone: true,
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class LoadingRedirectSection {
  @Input() code: string = '';

}

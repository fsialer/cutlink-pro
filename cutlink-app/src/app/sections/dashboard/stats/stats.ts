import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../components/card/card';

@Component({
  selector: 'app-stats-dashboard-section',
  imports: [CardComponent],
  standalone: true,
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class StatsDashBoardSection {
  @Input() totalLinks: number = 0;
  @Input() totalClicks: number = 0;
  @Input() totalLinksActive: number = 0;
  @Input() totalLinksExpired: number = 0;
}

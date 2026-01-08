import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-component',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() color: string = '';

}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure you want to do this?';
  @Input() buttonConfirmName: string = 'Yes';
  @Input() buttonCancelName: string = 'Cancel';
  @Input() colorConfirm: string = 'red';
  @Output() confirmDeleteEvent = new EventEmitter<void>();
  @Output() cancelDeleteEvent = new EventEmitter<void>();

  confirmDelete() {
    this.confirmDeleteEvent.emit()
  }

  cancelDelete() {
    this.cancelDeleteEvent.emit()
  }

}

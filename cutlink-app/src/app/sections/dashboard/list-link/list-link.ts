import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemLinkComponent } from '../../../components/item-link/item-link';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-link-dashboard-section',
  imports: [CommonModule, ItemLinkComponent, ConfirmModalComponent],
  standalone: true,
  templateUrl: './list-link.html',
  styleUrl: './list-link.css',
})
export class ListLinkDashboardSection {
  @Input() links: any[] = [];
  @Input() isLoadingLinks: boolean = false;
  @Output() confirmDeleteEvent = new EventEmitter<number | null>();
  title: string = 'Delete link';
  message: string = 'Are you sure you want to delete this link?';
  buttonConfirmName: string = 'Yes, Delete';
  buttonCancelName: string = 'Cancel';
  colorConfirm: string = 'red';
  showDeleteModal: boolean = false;
  linkToDeleteId: number | null = null;

  confirmDelete() {
    this.confirmDeleteEvent.emit(this.linkToDeleteId)
    this.cancelDelete()
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.linkToDeleteId = null;
  }
  deleteLink(urlId: number) {
    this.showDeleteModal = true;
    this.linkToDeleteId = urlId;
  }

}

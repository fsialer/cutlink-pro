import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-link-dashboard-section',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-link.html',
  styleUrl: './form-link.css',
})
export class FormLinkDashboardSection {
  @Output() createLinkEvent = new EventEmitter<FormGroup>();
  private fb = inject(FormBuilder);
  @Input() isCreating: boolean = false;

  createlinkForm: FormGroup = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]],
    expiration: ['0', [Validators.required]]
  });

  expirationOptions = [
    { value: '0', label: 'Never expires' },
    { value: '1', label: '1 Hour' },
    { value: '24', label: '1 Day' },
    { value: '168', label: '7 Days' },
    { value: '720', label: '30 Days' },
  ];

  createLink() {
    if (this.createlinkForm.invalid) return;
    this.createLinkEvent.emit(this.createlinkForm)
    this.createlinkForm.reset();
  }

}

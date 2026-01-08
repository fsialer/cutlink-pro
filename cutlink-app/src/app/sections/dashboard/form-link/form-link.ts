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
    url: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
    expiration: ['0', [Validators.required]]
  });

  createLink() {
    if (this.createlinkForm.invalid) return;
    this.createLinkEvent.emit(this.createlinkForm)
    this.createlinkForm.reset();
  }

}

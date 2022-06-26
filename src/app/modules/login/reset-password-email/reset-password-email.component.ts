import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MedpalService } from 'src/app/services/medpal.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss'],
})
export class ResetPasswordEmailComponent implements OnInit {
  isDoctor = false;
  submitted = false;
  public resetForm: FormGroup = new FormGroup({});
  constructor(
    private router: Router,
    private healthService: MedpalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
      ]),
    });
  }
  get f() {
    return this.resetForm.controls;
  }
  submit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
  }
}

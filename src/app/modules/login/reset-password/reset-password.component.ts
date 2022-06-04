import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MedpalService } from 'src/app/services/medpal.service';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  isDoctor = false;
  resetForm: FormGroup = new FormGroup({
    currentPwd: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPwd: new FormControl('', [Validators.required]),
  });
  matchPassword = false;
  
  constructor(private router: Router, private healthService: MedpalService, private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  pwdMatch() {
    setTimeout(() => {
      if (this.resetForm.value.confirmPwd === '' || this.resetForm.value.password === this.resetForm.value.confirmPwd) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    }, 0);
  }

  login(): void {
    if (this.resetForm.invalid || !this.matchPassword) {
      return;
    }
    const dialogRef = this.dialog.open(PopupComponent, {
      minWidth: '20vw',
      data: { title: 'Password Changed', successIcon: true, content: 'Your password has been changed successfully!', isAlert: true },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['medpal/patient/login']);
    });
  }
}

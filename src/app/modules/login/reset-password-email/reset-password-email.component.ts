import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MedpalService, CommonService } from 'src/app/services';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss'],
})
export class ResetPasswordEmailComponent implements OnInit {
  isDoctor = false;
  submitted = false;
  //enableLoader = false;
  public resetForm: FormGroup = new FormGroup({});
  constructor(
    private route: Router,
    private healthService: MedpalService,
    private dialog: MatDialog,
    public commonService: CommonService
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
    //this.enableLoader = true;
    const postData = this.resetForm.value;
    this.healthService.forgotPassWordSendEmail(postData).subscribe({
      next: (data: any) => {
        //this.enableLoader = false;
        this.submitted = false;
        const dialogRef = this.dialog.open(PopupComponent, {
          minWidth: '20vw',
          data: {
            title: 'Email Sent',
            successIcon: true,
            content:
              'Password reset link sent to your registered email... Check your email to reset your password...!',
            isAlert: true,
          },
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(() => {
          this.route.navigate(['/home']);
        });
        this.resetForm.reset();
      },
      error: (err) => {
        // this.enableLoader = false;
        this.submitted = false;
        this.commonService.showNotification(err);
      },
    });
  }
}

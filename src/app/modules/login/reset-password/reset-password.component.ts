import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { MedpalService, CommonService } from 'src/app/services';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  isDoctor = false;
  resetForm: FormGroup = new FormGroup({});
  matchPassword: any;
  userId: any;
  timestamp: any;
  userEmail: any;
  submitted = false;
  // enableLoader = false;
  constructor(
    private router: Router,
    private healthService: MedpalService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('_id');
    this.timestamp = this.route.snapshot.queryParamMap.get('stamp');
    this.userEmail = this.route.snapshot.queryParamMap.get('email');
    let datenow = Date.now();
    let diff = (datenow - this.timestamp) / 1000 / 60;
    let round = Math.round(diff);
    if (round > 120) {
      this.commonService.showNotification(
        'Password reset link expired. Resend the link to reset your password...!'
      );
      this.router.navigate(['./medpal/patient/forget-password']);
    }

    this.resetForm = new FormGroup({
      id: new FormControl(this.userId, [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]),
      confirmPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]),
    });
    this.matchPassword = false;
  }

  pwdMatch() {
    setTimeout(() => {
      if (
        this.resetForm.value.confirmPwd === '' ||
        this.resetForm.value.password === this.resetForm.value.confirmPwd
      ) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    }, 0);
  }
  get f() {
    return this.resetForm.controls;
  }
  login(): void {
    this.submitted = true;
    if (this.resetForm.invalid || !this.matchPassword) {
      return;
    }
    //this.enableLoader = true;
    const postData = this.resetForm.value;

    this.healthService.updatePassword(postData).subscribe({
      next: (data: any) => {
        //this.enableLoader = false;
        this.submitted = false;
        const dialogRef = this.dialog.open(PopupComponent, {
          minWidth: '20vw',
          data: {
            title: 'Password Changed',
            successIcon: true,
            content:
              'Your password has been changed successfully! Login with your new password...!',
            isAlert: true,
          },
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/medpal/patient/login'], {
            queryParams: { email: this.userEmail },
          });
        });
      },
      error: (err) => {
        //this.enableLoader = false;
        this.submitted = false;
        this.commonService.showNotification(err);
      },
    });
  }
}

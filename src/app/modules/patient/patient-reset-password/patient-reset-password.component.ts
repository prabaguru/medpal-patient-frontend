import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-patient-reset-password',
  templateUrl: './patient-reset-password.component.html',
  styleUrls: ['./patient-reset-password.component.scss'],
})
export class PatientProfileResetPasswordComponent implements OnInit {
  isDoctor = false;
  public showPassword: boolean = false;
  public showPasswordC: boolean = false;
  //public enableLoader = false;
  submitted = false;
  currentUser: any;
  matchPassword: any;
  public resetForm: FormGroup = new FormGroup({});
  constructor(
    private router: Router,
    private healthService: MedpalService,
    private dialog: MatDialog,
    public authService: AuthService,
    public commonService: CommonService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      id: new FormControl(this.currentUser._id ? this.currentUser._id : '', [
        Validators.required,
      ]),
      resetPass: new FormControl('reset', []),
      currentPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]),
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

    this.healthService.updatePatientProfile(postData).subscribe({
      next: (data: any) => {
        //this.enableLoader = false;
        this.submitted = false;
        const dialogRef = this.dialog.open(PopupComponent, {
          minWidth: '20vw',
          data: {
            title: 'Password Changed',
            successIcon: true,
            content: 'Your password has been changed successfully!',
            isAlert: true,
          },
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(() => {
          this.authService.logout();
          this.router.navigate(['medpal/patient/login']);
        });
      },
      error: (err) => {
        //this.enableLoader = false;
        this.submitted = false;
        this.commonService.showNotification(err);
      },
    });
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public togglePasswordVisibilityC(): void {
    this.showPasswordC = !this.showPasswordC;
  }
}

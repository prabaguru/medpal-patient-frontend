import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { OtpVerifyComponent } from 'src/app/shared/components/otp-verify/otp-verify.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.scss'],
})
export class PatientSignupComponent implements OnInit {
  isDoctor = false;
  public showPassword: boolean = false;
  //enableLoader = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    // CountryISO.UnitedArabEmirates,
    // CountryISO.UnitedStates,
    // CountryISO.UnitedKingdom,
  ];
  submitted = false;

  signupForm: FormGroup = new FormGroup({
    loginType: new FormControl('Patient'),
    regType: new FormControl('reg'),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-zA-Z '-]+$"),
      Validators.minLength(3),
    ]),
    mobile: new FormControl('', [Validators.required]),
    primaryMobile: new FormControl('', []),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(10),
    ]),
    confirmPwd: new FormControl('', [Validators.required]),
  });
  matchPassword = false;
  returnUrl: any;
  constructor(
    private healthService: MedpalService,
    private route: Router,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    public commonService: CommonService,
    public authService: AuthService
  ) {}
  get f() {
    return this.signupForm.controls;
  }
  ngOnInit(): void {
    this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.currentUserValue) {
      this.route.navigate(['/home'], {
        queryParams: { returnUrl: this.returnUrl },
      });
    }
  }

  resetmobilefield() {
    if (this.signupForm.controls.mobile.value) {
      this.signupForm.controls.mobile.setValue('');
    }
  }

  pwdMatch() {
    setTimeout(() => {
      if (
        this.signupForm.value.confirmPwd === '' ||
        this.signupForm.value.password === this.signupForm.value.confirmPwd
      ) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    }, 0);
  }

  register(): void {
    this.submitted = true;
    if (this.signupForm.invalid && this.matchPassword) {
      return;
    }
    if (this.signupForm.valid) {
      let pm = this.f['mobile'].value;
      pm = pm.number.replace(/ /g, '');
      pm = pm.substring(1);
      this.f['primaryMobile'].setValue('');
      this.f['primaryMobile'].setValue(pm);
      this.checkemail();
    }
  }

  checkemail(): void {
    this.healthService
      .patientCheckEmail({ email: this.f['email'].value })
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.regRLogin();
        },
        error: (error) => {
          this.commonService.showNotification(error);
        },
        complete: () => {},
      });
  }

  regRLogin() {
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      minWidth: '30vw',
      disableClose: true,
      data: {
        title: 'OTP Verification',
        isOtpVerify: true,
        mobileNo: this.f['primaryMobile'].value,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.authService
          .reglogin(this.signupForm.value)
          .pipe(first())
          .subscribe({
            next: (res) => {
              if (res) {
                const token = this.authService.currentUserValue.token;
                if (token) {
                  this.route.navigate(['patient/profile']);
                  this.commonService.showNotification(
                    `Welcome ${res.firstName}!`
                  );
                }
              } else {
                this.route.navigate([this.returnUrl]);
              }
              this.submitted = false;
            },
            error: (err) => {
              this.submitted = false;
              this.commonService.showNotification(err);
              // error action over here
            },
          });
      }
    });
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

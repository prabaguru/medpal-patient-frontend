import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { CommonService } from 'src/app/services/common.service';
import { MedpalService } from 'src/app/services/medpal.service';
import { OtpVerifyComponent } from 'src/app/shared/components/otp-verify/otp-verify.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.scss']
})
export class PatientSignupComponent implements OnInit {

  isDoctor = false;
  enableLoader = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required]),
    confirmPwd: new FormControl('', [Validators.required]),
  });
  matchPassword = false;
  
  constructor(private healthService: MedpalService, public router: Router, private dialog: MatDialog,
    public commonService: CommonService) {}

  ngOnInit(): void {
  }

  resetmobilefield() {
    if (this.signupForm.controls.mobile.value) {
      this.signupForm.controls.mobile.setValue("");
    }
  }

  pwdMatch() {
    setTimeout(() => {
      if (this.signupForm.value.confirmPwd === '' || this.signupForm.value.password === this.signupForm.value.confirmPwd) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    }, 0);
  }

  register(): void {
    if (!this.signupForm.valid && this.matchPassword) {
      return;
    }
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      minWidth: '30vw',
      data: { title: 'OTP Verification', isOtpVerify: true, mobileNo: this.signupForm.value.mobile},
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.enableLoader = true;
        this.healthService.patientRegister(this.signupForm.value).subscribe({
          next: (data) => {
            this.enableLoader = false;
            const dialogRef2 = this.dialog.open(PopupComponent, {
              minWidth: '20vw',
              data: { successIcon: true, content: 'Registration Done!', isAlert: true },
              autoFocus: false
            });
            dialogRef2.afterClosed().subscribe(() => {
              this.router.navigate(['/medpal/patient/login']);
            });
          }, error: (err) => {
            this.enableLoader = false;
            this.commonService.showNotification(err.message);
            // error action over here
          }
        })
      }
    });
  }
}

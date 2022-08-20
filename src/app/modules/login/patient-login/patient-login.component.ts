import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { first } from 'rxjs/operators';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.scss'],
})
export class PatientLoginComponent implements OnInit {
  //enableLoader = false;
  returnUrl: any;
  userEmail: any;
  loginForm: FormGroup = new FormGroup({});
  isOtpVisible: boolean = true;
  otpBtnText: String = 'SEND OTP';
  hidden: boolean = true;
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput: any;
  config: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
  };
  timeLeft: number = 10;
  interval: any;
  disableOtpBtn: boolean = false;
  otp: any;
  showOtpComponent: boolean = true;
  otpListCtrl = new FormControl('', Validators.required);

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private healthService: MedpalService,
    private commonService: CommonService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userEmail = this.router.snapshot.queryParams['email'] || '';
    this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.currentUserValue) {
      this.route.navigate(['/medpal'], {
        queryParams: { returnUrl: this.returnUrl },
      });
    }

    this.loginForm = new FormGroup({
      loginType: new FormControl('lwp', []),
      mobile: new FormControl('', []),
      email: new FormControl(this.userEmail ? this.userEmail : '', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get g() {
    return this.loginForm;
  }
  get f() {
    return this.loginForm.controls;
  }
  onLoginChange(e: string) {
    if (e === 'lwotp') {
      this.cdr.detectChanges();
      this.ngOtpInput.otpForm.disable();
      this.f['email'].clearValidators();
      this.f['password'].clearValidators();
      this.f['email'].setValue(null);
      this.f['password'].setValue(null);
      this.f['email'].setErrors(null);
      this.f['password'].setErrors(null);
      this.f['mobile'].addValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
      this.otpBtnText = 'SEND OTP';
    } else {
      this.f['mobile'].clearValidators();
      this.f['mobile'].setValue(null);
      this.f['mobile'].setErrors(null);
      this.f['email'].addValidators([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]);
      this.f['password'].addValidators([Validators.required]);
    }
  }
  rememberMe() {
    // checked data here
  }

  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  sendOtp() {
    if (this.f['mobile'].value == '' || this.f['mobile'].value == null) {
      this.commonService.showNotification('Enter Mobile No...');
      return;
    } else {
      this.otp = '';
      this.otp = this.generateOtp();
      console.log('otp- ' + this.otp);
      this.isOtpVisible = true;
      this.disableOtpBtn = true;
      this.startTimer();
      this.timeLeft = 10;
      this.otpBtnText = 'sec left to enter OTP';
      this.toggleDisable();
      this.f['mobile'].disable();
      this.f['loginType'].disable();
      this.ngOtpInput.setValue('');
      //this.onSubmitOtp(this.otp);
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      if (this.timeLeft == 0) {
        this.disableOtpBtn = false;
        this.pauseTimer();
        this.otpBtnText = 'OTP Expired Resend OTP';
        this.toggleDisable();
        this.f['mobile'].enable();
        this.f['loginType'].enable();
        this.ngOtpInput.setValue('');
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  submitOtp() {
    let enteredOtp = this.otpListCtrl.value;
    let otp = this.otp.toString();
    if (enteredOtp == '') {
      this.commonService.showNotification('Enter OTP...');
      return;
    }
    if (enteredOtp === otp) {
      this.commonService.showNotification('OTP success...');
    } else {
      this.commonService.showNotification('OTP entered is wrong...');
      return;
    }
  }
  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    //this.enableLoader = true;

    this.authService
      .login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      )
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.route.navigate(['medpal/patient/profile']);
              this.commonService.showNotification(`Welcome ${res.firstName}!`);
            }
          } else {
            // this.enableLoader = false;
            this.route.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          //this.enableLoader = false;
          this.commonService.showNotification(error);
        },
        complete: () => {},
      });
  }
}

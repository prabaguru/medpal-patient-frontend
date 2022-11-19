import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonService, MedpalService } from 'src/app/services';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { first } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit {
  public title = '';
  submitted: boolean = false;
  isOtpVisible: boolean = true;
  otpBtnText: String = 'SEND OTP';
  hidden: boolean = true;
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput: any;
  config: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
  };
  timeLeft: number = 90;
  interval: any;
  disableOtpBtn: boolean = false;
  otp: any;
  otpListCtrl = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<OtpVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public commonService: CommonService,
    private cdr: ChangeDetectorRef,
    public medpalService: MedpalService
  ) {
    if (this.data) {
      this.title = data.title;
    }
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.ngOtpInput.otpForm.disable();
    this.cdr.detectChanges();
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
    this.otp = '';
    this.otp = this.generateOtp();
    //console.log('otp- ' + this.otp);
    this.isOtpVisible = true;
    this.disableOtpBtn = true;
    this.startTimer();
    this.timeLeft = 90;
    this.otpBtnText = 'sec left to enter OTP';
    this.toggleDisable();
    this.ngOtpInput.setValue('');
    this.onSubmitOtp(this.otp);
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
        this.ngOtpInput.setValue('');
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  verify() {
    // if given otp is valid
    //this.dialogRef.close(true);
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
      this.dialogRef.close(true);
    } else {
      this.commonService.showNotification('OTP entered is wrong...');
      return;
    }
  }

  onSubmitOtp(otp: string) {
    let msgString = `Your OTP for login into Medpal  is  - ${otp} . OTP will expire in 90 sec. Thank you. Medpal - Weisermanner`;
    let payload = {
      From: 'WEISER',
      To: this.data.mobileNo,
      Body: msgString,
      dltentityid: 1601335161674716856,
      dlttemplateid: 1607100000000226780,
    };
    this.sendSMSafterBooking(payload);
  }

  sendSMSafterBooking(payload: any) {
    this.medpalService
      .sendSMS(payload)
      .pipe(first())
      .subscribe(
        (data: any) => {
          //console.log(this.bookedTimeslot);
        },
        (error) => {
          this.commonService.showNotification(error);
        }
      );
  }
}

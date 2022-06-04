import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss']
})
export class OtpVerifyComponent implements OnInit {

  public title = '';
  public content: any;
  public isAlert = false;
  public isOtpVerify = false;
  public timeLeft = '2:00';
  public countDownTime = 2* 1000 * 60;
  public interval: any;
  public accept = 'Ok';
  public cancel = 'Cancel';
  public isDisabledAccept = false;

  constructor(public dialogRef: MatDialogRef<OtpVerifyComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.title = data.title;
      this.content = data.content;
      this.isAlert = data.isAlert ? true : false;
      this.isOtpVerify = data.isOtpVerify ? true : false;
      if (data.accept) { this.accept = data.accept; }
    }
  }

  ngOnInit(): void {
    if (this.isOtpVerify) {
      this.accept = 'Verify & Proceed';
      this.initiateCountDown();
    }
  }

  initiateCountDown() {
    this.interval = setInterval(() => {
      this.startCountingDown();
    }, 1000);
    setTimeout(() => {
      clearInterval(this.interval);
      this.isDisabledAccept = true;
      // this.dialogRef.close('');
    }, this.countDownTime);
  }

  startCountingDown() {
    const time = this.timeLeft.split(':');
    let minutes = +time[0];
    let seconds = +time[1];
    if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else  {
      seconds--;
    }
    this.timeLeft = minutes  + ':' +  (seconds < 10 ? '0' + seconds : seconds);
  }
  verify() {
    // if given otp is valid
    this.dialogRef.close(true);
  }
}

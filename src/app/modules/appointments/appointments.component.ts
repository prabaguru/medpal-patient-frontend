import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
declare var $: any;
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  editable: boolean = true;
  isEditable: boolean = false;
  clinicNumber: any = [];
  doc: any = [];
  pushPage: boolean = false;
  timingSlots = [];
  showtemplate: boolean = false;
  @Input() data: any;
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    new Date().getDay()
  ];
  momweekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  minDate: Date;
  maxDate: Date;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  otpListCtrl = new FormControl('', Validators.required);
  submitted: boolean = false;
  secSubmitted: boolean = true;
  isOtpVisible: boolean = false;
  otpBtnText: String = 'SEND OTP';
  hidden: boolean = true;
  config = {
    length: 6,
    allowNumbersOnly: true,
  };
  timeLeft: number = 60;
  interval: any;
  disableOtpBtn: boolean = false;
  otp: any;
  loggedIn: boolean = false;
  userInfo: any;
  formatDate: any;
  updateUser: Boolean = false;
  appoinmentDetails: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    public medpalService: MedpalService,
    private _formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.minDate = moment(moment.now()).toDate();
    this.maxDate = moment(this.minDate, 'DD/MM/YYYY').add(10, 'days').toDate();

    this.firstFormGroup = this._formBuilder.group({
      slot: ['', Validators.required],
      appointmentDate: [this.minDate, Validators.required],
      bookedDate: [''],
      bookedDay: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      mobNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
        ],
      ],
    });
    this.thirdFormGroup = this._formBuilder.group({
      appointmentFor: [false, Validators.required],
      confirmbooking: ['', Validators.required],
      primaryMobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
        ],
      ],
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
          Validators.minLength(3),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.f['appointmentDate'].setValue('');
    this.f['appointmentDate'].setValue(this.minDate);
    this.doc = {};
    this.timingSlots = [];
    this.showtemplate = false;
    this.setUserInfo();
    if (changes.data.currentValue !== undefined) {
      this.doc = changes.data.currentValue.mainObj;
    }
    if (Object.getOwnPropertyNames(this.doc).length > 0) {
      this.showtemplate = true;
      this.generateSlots(this.weekday);
    }
  }
  ngOnInit(): void {
    window.scroll(0, 0);
    this.setUserInfo();
  }

  setUserInfo() {
    this.userInfo = null;
    if (this.authService.currentUserValue) {
      this.userInfo = this.authService.currentUserValue;
      this.loggedIn = true;
      this.submitted = true;
    } else {
      this.loggedIn = false;
      this.submitted = false;
    }
    if (!this.loggedIn) {
      this.thirdFormGroup.patchValue({
        firstName: '',
        email: '',
        primaryMobile: '',
        appointmentFor: false,
        confirmbooking: false,
      });
    } else {
      let firstName = null;
      if (this.userInfo.firstName === 'newuser') {
        firstName = '';
      } else {
        firstName = this.userInfo.firstName;
        this.g['firstName'].disable();
      }
      let uemail = this.validateEmail(this.userInfo.email);
      let email = null;
      if (uemail) {
        this.updateUser = false;
        email = this.userInfo.email;
        this.g['email'].disable();
      } else {
        email = '';
        this.updateUser = true;
      }
      this.thirdFormGroup.patchValue({
        appointmentFor: false,
        firstName: firstName,
        email: email,
        primaryMobile: this.userInfo.primaryMobile,
        confirmbooking: false,
      });

      this.g['primaryMobile'].disable();
    }
  }
  getDay(e: any) {
    this.timingSlots = [];
    let date;
    date = moment(e.value._d).day();
    this.generateSlots(this.momweekday[date]);
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  get t() {
    return this.secondFormGroup.controls;
  }
  get g() {
    return this.thirdFormGroup.controls;
  }
  generateSlots(slot: string) {
    this.f['slot'].setValue('');
    if (slot === 'Sun' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.SundaySlots;
    }
    if (slot === 'Sun' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.SundaySlots;
    }
    if (slot === 'Mon' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.MondaySlots;
    }
    if (slot === 'Mon' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.MondaySlots;
    }
    if (slot === 'Tue' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.TuesdaySlots;
    }
    if (slot === 'Tue' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.TuesdaySlots;
    }
    if (slot === 'Wed' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.WednesdaySlots;
    }
    if (slot === 'Wed' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.WednesdaySlots;
    }
    if (slot === 'Thu' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.ThursdaySlots;
    }
    if (slot === 'Thu' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.ThursdaySlots;
    }
    if (slot === 'Fri' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.FridaySlots;
    }
    if (slot === 'Fri' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.FridaySlots;
    }
    if (slot === 'Sat' && this.doc.clinic1) {
      this.timingSlots = this.doc.ClinicOneTimings.SaturdaySlots;
    }
    if (slot === 'Sat' && this.doc.clinic2) {
      this.timingSlots = this.doc.ClinicTwoTimings.SaturdaySlots;
    }
  }
  submit() {
    let confirmbooking = this.g['confirmbooking'].value;
    if (!confirmbooking) {
      this.commonService.showNotification('Check confirm booking...');
      return;
    }

    if (this.thirdFormGroup.valid) {
      //console.log(this.thirdFormGroup.value);
    } else {
      this.commonService.showNotification(
        'Kindly fillin the mandatory fields...'
      );
      return;
    }
    this.createObjects();
    let docGrad = '';
    if (this.doc.graduation.Graduation === 'PG') {
      docGrad = `(${this.doc.graduation.qualificationUG.sName} - ${this.doc.graduation.qualificationPG.sName} - ${this.doc.graduation.specialisationPG.name}) : ${this.doc.graduation.DoctorType.name}`;
    } else {
      docGrad = `(${this.doc.graduation.qualificationUG.sName}) : ${this.doc.graduation.DoctorType.name}`;
    }
    let clinicloc = '';
    if (this.doc.clinic1) {
      clinicloc = this.doc.ClinicOneTimings.ClinicLocation.address;
    } else {
      clinicloc = this.doc.ClinicTwoTimings.ClinicLocation.address;
    }
    let formatDate = moment(this.f['appointmentDate'].value).format('x');
    let apiobj = {
      p_id: this.userInfo._id,
      slot: this.f['slot'].value,
      appointmentDate: formatDate,
      bookedDate: this.f['bookedDate'].value,
      bookedDay: this.f['bookedDay'].value,
      appointmentFor: this.g['appointmentFor'].value,
      email: this.g['email'].value,
      firstName: this.g['firstName'].value,
      primaryMobile: this.g['primaryMobile'].value,
      consultingFees: this.doc.clinic1
        ? this.doc.ClinicOneTimings.ConsultationFeesC1
        : this.doc.ClinicTwoTimings.ConsultationFeesC1,
      d_id: this.doc._id,
      doctorName: this.doc.firstName,
      doctorQualification: docGrad,
      clinic: this.doc.clinic1 ? 'Clinic1' : 'Clinic2',
      ClinicAddress: clinicloc,
    };
    // let forOthers = this.g['appointmentFor'].value;
    // if (this.updateUser && !forOthers) {
    //   let updateObj = {
    //     firstname: this.g['firstName'].value,
    //     email: this.g['email'].value,
    //   };
    // }

    this.medpalService.bookAppointment(apiobj).subscribe({
      next: (data: any) => {
        this.stepper.next();
        this.commonService.showNotification(data.message);
      },
      error: (err) => {
        this.commonService.showNotification(err);
        this.g['confirmbooking'].setValue(false);
      },
    });
  }

  createObjects() {
    let formatDate = moment(this.f['appointmentDate'].value).format('x');
    let obj = {
      p_id: this.userInfo._id,
      slot: this.f['slot'].value,
      appointmentDate: formatDate,
      bookedDate: this.f['bookedDate'].value,
      bookedDay: this.f['bookedDay'].value,
      appointmentFor: this.g['appointmentFor'].value,
      email: this.g['email'].value,
      firstName: this.g['firstName'].value,
      primaryMobile: this.g['primaryMobile'].value,
      consultingFees: this.doc.clinic1
        ? this.doc.ClinicOneTimings.ConsultationFeesC1
        : this.doc.ClinicTwoTimings.ConsultationFeesC1,
      d_id: this.doc._id,
      doctorname: this.doc.firstName,
      DocDetails: this.doc.graduation,
      clinic: this.doc.clinic1 ? 'Clinic1' : 'Clinic2',
      ClinicAddress: this.doc.clinic1
        ? this.doc.ClinicOneTimings.ClinicLocation
        : this.doc.ClinicTwoTimings.ClinicLocation,
    };
    this.appoinmentDetails = null;
    this.appoinmentDetails = obj;
  }
  checkval() {
    // if (this.secondFormGroup.invalid) {
    //   this.submitted = true;
    // } else {
    //   this.submitted = false;
    // }
  }
  checkvalFone() {
    if (this.firstFormGroup.invalid) {
      this.commonService.showNotification('Select Appointment slot...');
      return;
    }
  }

  resetForm() {
    this.isOtpVisible = false;
    this.disableOtpBtn = false;
    this.timingSlots = [];
    this.otpBtnText = 'SEND OTP';
    this.pauseTimer();
    this.timeLeft = 0;
    this.secondFormGroup.get('mobNo')?.enable({ onlySelf: true });
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.setUserInfo();
  }
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  sendOtp() {
    this.otp = '';
    this.otp = this.generateOtp();
    console.log('otp- ' + this.otp);
    this.isOtpVisible = true;
    this.disableOtpBtn = true;
    this.startTimer();
    this.timeLeft = 60;
    this.otpBtnText = 'sec left to enter OTP';
    this.secondFormGroup.get('mobNo')?.disable({ onlySelf: true });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      if (this.timeLeft == 0) {
        this.disableOtpBtn = false;
        this.isOtpVisible = false;
        this.pauseTimer();
        this.otpBtnText = 'OTP Expired Resend OTP';
        this.secondFormGroup.get('mobNo')?.enable({ onlySelf: true });
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  submitOtp() {
    if (this.secondFormGroup.invalid) {
      return;
    }
    let enteredOtp = this.otpListCtrl.value;
    let otp = this.otp.toString();
    if (enteredOtp === otp) {
      this.commonService.showNotification('OTP success...');
      let obj = {
        firstName: 'newuser',
        password: 'newuser',
        mobile: {
          number: this.t['mobNo'].value,
          countryCode: 'IN',
          dialCode: '+91',
        },
        primaryMobile: this.t['mobNo'].value,
        email: enteredOtp,
      };
      this.regNLogin(obj);
    } else {
      this.commonService.showNotification('OTP entered is wrong...');
      return;
    }
  }

  regNLogin(obj: any) {
    this.authService
      .reglogin(obj)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            this.userInfo = null;
            this.userInfo = this.authService.currentUserValue;
            if (token) {
              this.loggedIn = true;
              this.commonService.showNotification(`Welcome ${res.firstName}!`);
              this.submitted = true;
              this.setformvalue(this.userInfo);
            }
          }
        },
        error: (err) => {
          this.commonService.showNotification(err);
          this.submitted = false;
          // error action over here
        },
      });
  }
  bookfortoggle(e: Boolean) {
    e ? this.resetsetformvalue() : this.setformvalue(this.userInfo);
  }
  validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  setformvalue(res: any) {
    if (res.firstName === 'newuser') {
      this.g['firstName'].setValue('');
    } else {
      this.g['firstName'].setValue(res.firstName);
      this.g['firstName'].disable();
    }
    let uemail = this.validateEmail(res.email);
    if (uemail) {
      this.g['email'].setValue(res.email);
      this.g['email'].disable();
      this.updateUser = false;
    } else {
      this.g['email'].setValue('');
      this.updateUser = true;
    }
    this.g['primaryMobile'].setValue(res.primaryMobile);
    this.g['primaryMobile'].disable();
  }
  resetsetformvalue() {
    this.g['firstName'].setValue('');
    this.g['firstName'].enable();
    this.g['primaryMobile'].setValue('');
    this.g['primaryMobile'].enable();
    this.g['email'].setValue('');
    this.g['email'].enable();
  }
  slotToggle() {
    this.stepper.next();
  }
  stepperChange(e: any) {
    if (e.selectedIndex === 1) {
      this.formatDate = null;
      let appval = null;
      appval = this.f['appointmentDate'].value;
      this.formatDate = moment(appval).format('DD/MM/YYYY');
      this.f['bookedDate'].setValue(this.formatDate);
      this.f['bookedDay'].setValue(moment(appval).format('ddd'));
    }
    if (e.selectedIndex === 2) {
      this.editable = false;
      //e.previouslySelectedStep._editable = false;
    }
  }
}

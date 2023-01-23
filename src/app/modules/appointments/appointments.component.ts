import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
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
(moment as any).suppressDeprecationWarnings = true;
import { first } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
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
export class AppointmentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild('stepper') stepper!: MatStepper;

  editable: boolean = true;
  isEditable: boolean = false;
  clinicNumber: any = [];
  doc: any = [];
  pushPage: boolean = false;
  timingSlotsFlag: boolean = false;
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
  timeLeft: number = 90;
  interval: any;
  disableOtpBtn: boolean = false;
  otp: any;
  loggedIn: boolean = false;
  userInfo: any;
  formatDate: any;
  updateUser: Boolean = false;
  appoinmentDetails: any;
  finalTimeslot: any = [];
  bookedppointments: any = [];
  bookedTimeslot: any = [];
  serverTime: any;
  smsHelpLine: any;
  appId: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    public medpalService: MedpalService,
    private _formBuilder: FormBuilder,
    public authService: AuthService,
    location: PlatformLocation
  ) {
    super();
    location.onPopState(() => {
      $('#staticBackdropAppointments').modal('hide');
    });
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
      appointmentType: [false, Validators.required],
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
    this.timingSlotsFlag = false;
    this.showtemplate = false;
    this.setUserInfo();
    if (changes.data.currentValue !== undefined) {
      this.doc = changes.data.currentValue.mainObj;
      this.getAppointmentsById();
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
    let checkSlot = this.slotCheck(this.momweekday[date]);
    if (checkSlot) {
      this.getAppointmentsById(date);
      this.timingSlotsFlag = false;
    } else {
      this.finalTimeslot = [];
      this.timingSlotsFlag = true;
    }
    //this.generateSlots(this.momweekday[date]);
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
  slotCheck(slot: string) {
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
    if (this.timingSlots.length > 0) {
      return true;
    } else {
      return false;
    }
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

    //console.log(this.timingSlots);
    let getTime = moment(this.serverTime, 'hh:mm a').add(30, 'minutes');
    let halfAnHourAgo: any = moment(getTime).unix();
    //console.log(halfAnHourAgo);

    this.finalTimeslot = [];
    // this.bookedTimeslot = this.doc.clinic1
    //   ? this.doc.clinic1appointments
    //   : this.doc.clinic2appointments;
    let arrLength = this.timingSlots.length;
    let barrLength = this.bookedTimeslot.length;
    for (let i = 0; i < arrLength; i++) {
      let dd = this.changeTS(this.timingSlots[i]);
      this.finalTimeslot.push({
        time: dd,
        Stime: moment.unix(dd).format('hh:mm a'),
        disabled: dd > halfAnHourAgo ? false : true,
      });
      if (this.finalTimeslot.length == arrLength) {
        let frrLength = this.finalTimeslot.length;
        for (let i = 0; i < frrLength; i++) {
          for (let j = 0; j < barrLength; j++) {
            if (this.finalTimeslot[i].time === this.bookedTimeslot[j]) {
              this.finalTimeslot[i].disabled = true;
            }
          }
        }
      }
    }
    if (this.timingSlots.length > 0) {
      this.timingSlotsFlag = false;
    } else {
      this.timingSlotsFlag = true;
    }
    //console.log(this.finalTimeslot);
  }

  changeTS(ts: string) {
    let calDate = null;
    let dt = null;
    let dateeObj = null;
    calDate = this.f['appointmentDate'].value;
    dateeObj = moment(calDate).format('DD/MM/YYYY');
    let concot = dateeObj + ' ' + ts;
    dt = moment(concot, 'DD/MM/YYYY hh:mm a').unix();
    return dt;
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
    let cord = [];
    if (this.doc.clinic1) {
      clinicloc = this.doc.ClinicOneTimings.ClinicLocation.address;
      cord = [
        this.doc.ClinicOneTimings.ClinicLocation.loc.x,
        this.doc.ClinicOneTimings.ClinicLocation.loc.y,
      ];
    } else {
      clinicloc = this.doc.ClinicTwoTimings.ClinicLocation.address;
      cord = [
        this.doc.ClinicTwoTimings.ClinicLocation.loc.x,
        this.doc.ClinicTwoTimings.ClinicLocation.loc.y,
      ];
    }
    let dateeObj = '';
    let concot = '';
    let formatDate = null;
    dateeObj = moment(this.f['appointmentDate'].value).format('DD/MM/YYYY');
    concot = dateeObj + ' ' + this.f['slot'].value;
    formatDate = moment(concot, 'DD/MM/YYYY hh:mm a').unix();
    let apiobj = {
      p_id: this.userInfo._id,
      slot: this.f['slot'].value,
      appointmentDate: formatDate,
      dateStmp: moment(dateeObj, 'DD/MM/YYYY').unix(),
      bookedDate: this.f['bookedDate'].value,
      bookedDay: this.f['bookedDay'].value,
      appointmentFor: this.g['appointmentFor'].value,
      appointmentType:
        this.g['appointmentType'].value == true
          ? 'Online Video Consulting'
          : 'Clinic Visit',
      email: this.g['email'].value,
      firstName: this.g['firstName'].value,
      primaryMobile: this.g['primaryMobile'].value,
      consultingFees: this.doc.clinic1
        ? this.doc.ClinicOneTimings.ConsultationFeesC1
        : this.doc.ClinicTwoTimings.ConsultationFeesC1,
      d_id: this.doc._id,
      h_id: this.doc.hId,
      doctorName: this.doc.firstName,
      doctorQualification: docGrad,
      clinic: this.doc.clinic1 ? 'Clinic1' : 'Clinic2',
      ClinicAddress: clinicloc,
      cord: cord,
      clinicName: this.doc.ClinicOneTimings.ClinicName,
    };

    this.subs.sink = this.medpalService.bookAppointment(apiobj).subscribe({
      next: (data: any) => {
        this.stepper.next();
        this.appId = null;
        this.appId = data.data.id;
        this.commonService.showNotification(data.message);
        this.updateAppointments(apiobj);
      },
      error: (err) => {
        this.commonService.showNotification(err);
        this.g['confirmbooking'].setValue(false);
        this.editable = true;
      },
    });
  }
  updateAppointments(updateObj: any) {
    let obj = {};
    let docAppo = [];
    let clinic1app = [];
    let clinic2app = [];
    let arr = 0;
    let getdate = moment().format('DD/MM/YYYY');
    let currentDate = moment(getdate, 'DD/MM/YYYY').unix();
    if (updateObj.clinic === 'Clinic1') {
      docAppo = this.bookedTimeslot;
      docAppo.push(updateObj.appointmentDate);
      arr = docAppo.length;
      for (let i = 0; i < arr; i++) {
        if (docAppo[i] >= currentDate) {
          clinic1app.push(docAppo[i]);
        }
      }
      obj = {
        id: updateObj.d_id,
        clinic: updateObj.clinic,
        updateAppointment: true,
        clinic1appointments: clinic1app,
      };
    } else {
      docAppo = this.bookedTimeslot;
      docAppo.push(updateObj.appointmentDate);
      arr = docAppo.length;
      for (let i = 0; i < arr; i++) {
        if (docAppo[i] >= currentDate) {
          clinic2app.push(docAppo[i]);
        }
      }
      obj = {
        id: updateObj.d_id,
        clinic: updateObj.clinic,
        updateAppointment: true,
        clinic2appointments: clinic2app,
      };
    }

    this.subs.sink = this.medpalService
      .updateDoctorAppointments(obj)
      .subscribe({
        next: (data: any) => {
          this.confirmBookingSms();
          //this.confirmBookingSms();
          //this.commonService.showNotification(data.message);
        },
        error: (err) => {
          //this.commonService.showNotification(err);
        },
      });
  }

  updateUserFNE() {
    let forOthers = this.g['appointmentFor'].value;
    let updateObj = {
      id: '',
      firstName: '',
      email: '',
    };
    if (this.updateUser && !forOthers) {
      updateObj = {
        id: this.userInfo._id,
        firstName: this.g['firstName'].value,
        email: this.g['email'].value,
      };
    }
    if (!updateObj.id || !updateObj.firstName || !updateObj.email) {
      return;
    }
    this.subs.sink = this.medpalService.updatePatientFNE(updateObj).subscribe({
      next: (data: any) => {
        let obj = {
          firstName: updateObj.firstName,
          email: updateObj.email,
        };
        this.updateUser = false;
        this.updateCurrentUserData(updateObj);
        //this.commonService.showNotification(data.message);
      },
      error: (err) => {
        //this.commonService.showNotification(err);
      },
    });
  }
  createObjects() {
    let dateeObj = '';
    let concot = '';
    let formatDate = null;
    dateeObj = moment(this.f['appointmentDate'].value).format('DD/MM/YYYY');
    concot = dateeObj + ' ' + this.f['slot'].value;
    formatDate = moment(concot, 'DD/MM/YYYY hh:mm a').unix();
    let obj = {
      p_id: this.userInfo._id,
      slot: this.f['slot'].value,
      appointmentDate: formatDate,
      bookedDate: this.f['bookedDate'].value,
      bookedDay: this.f['bookedDay'].value,
      appointmentFor: this.g['appointmentFor'].value,
      appointmentType:
        this.g['appointmentType'].value == true
          ? 'Online Video Consulting'
          : 'Clinic Visit',
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

  resetForm(r?: string) {
    if (this.updateUser) {
      this.updateUserFNE();
    }
    this.isOtpVisible = false;
    this.disableOtpBtn = false;
    this.timingSlots = [];
    this.timingSlotsFlag = false;
    this.otpBtnText = 'SEND OTP';
    this.pauseTimer();
    this.timeLeft = 0;
    this.secondFormGroup.get('mobNo')?.enable({ onlySelf: true });
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.setUserInfo();
    this.editable = true;
    if (r === 're') {
      this.router.navigate(['/home']);
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
    this.secondFormGroup.get('mobNo')?.disable({ onlySelf: true });
    this.onSubmitOtp(this.otp);
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
    this.subs.sink = this.authService
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
  slotToggle(time: any) {
    let bTime = new Date(time.time * 1000);
    let curdate = new Date();
    let check = bTime.toDateString() == curdate.toDateString();
    if (check) {
      let curTime = moment().unix();
      let startTime = moment.unix(curTime);
      let endTime = moment.unix(time.time);
      let dif = moment(endTime).diff(moment(startTime), 'minutes');
      if (dif < 30) {
        this.commonService.showNotification('This Timeslot has elapsed');
        this.getAppointmentsById();
      } else {
        this.stepper.next();
      }
    } else {
      this.stepper.next();
    }
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
  getAppointmentsById(d?: any) {
    this.bookedTimeslot = [];
    this.serverTime = null;
    let obj: any = {
      id: this.doc._id,
      clinic: this.doc.clinic1 ? 'Clinic1' : 'Clinic2',
    };
    this.subs.sink = this.medpalService
      .getDoctorAppointments(obj)
      .pipe(first())
      .subscribe(
        (data: any) => {
          let clinic = data.clinic;
          let app =
            clinic === 'Clinic1'
              ? data.data.clinic1appointments
              : data.data.clinic2appointments;
          this.bookedTimeslot = app;
          this.serverTime = data.currentTime;
          if (Object.getOwnPropertyNames(this.doc).length > 0) {
            this.showtemplate = true;
            this.generateSlots(
              this.momweekday[d] ? this.momweekday[d] : this.weekday
            );
          }
          this.getHopitalById();
          //console.log(this.bookedTimeslot);
        },
        (error) => {
          this.commonService.showNotification(error);
        }
      );
  }
  getHopitalById(d?: any) {
    this.subs.sink = this.medpalService
      .getHopitalById(this.doc.hId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.smsHelpLine = null;
          this.smsHelpLine = data.smsHelpLineNo
            ? data.smsHelpLineNo
            : this.doc.mobile.number;
        },
        (error) => {
          this.commonService.showNotification(error);
        }
      );
  }
  updateCurrentUserData(obj: any) {
    const oldInfo = JSON.parse(
      localStorage.getItem('loggedInUserData') as string
    );
    localStorage.setItem(
      'loggedInUserData',
      JSON.stringify({ ...oldInfo, ...obj })
    );
    this.authService.updateUserObjOnSave(
      JSON.parse(localStorage.getItem('loggedInUserData') as string)
    );
    this.userInfo = [];
    this.userInfo = this.authService.currentUserValue;
  }

  onSubmitOtp(otp: string) {
    let mobileNo = this.t['mobNo'].value;
    let msgString = '';
    msgString = `Your OTP to book appointment is  - ${otp} . Please be 10 mins before your consultation time. Thank you. Medpal - Weisermanner`;
    let payload = {
      From: 'WEISER',
      To: mobileNo,
      Body: msgString,
      dltentityid: '1601335161674716856',
      dlttemplateid: '1607100000000226779',
    };
    this.sendSMSafterBooking(payload);
  }

  confirmBookingSms() {
    let mobileNo = this.g['primaryMobile'].value;
    let docName = this.doc.firstName;
    let mob = this.smsHelpLine;
    let bookedfor = `${this.g['firstName'].value.toUpperCase()} on ${
      this.f['bookedDate'].value
    } - ${this.f['bookedDay'].value} at ${this.f['slot'].value}`;
    let th = `https://medpal.live/sms.html?dep,${this.appId}`;
    let msgString = '';
    msgString = `The consult at ${this.doc.ClinicOneTimings.ClinicName.toUpperCase()} with Dr. ${docName.toUpperCase()} is booked for ${bookedfor} . Our Helpline no is ${mob} . ${th}. Thank you. Medpal - Weisermanner`;
    let payload = {
      From: 'WEISER',
      To: mobileNo,
      Body: msgString,
      dltentityid: '1601335161674716856',
      dlttemplateid: '1607100000000248206',
    };
    this.sendSMSafterBooking(payload);
  }

  sendSMSafterBooking(payload: any) {
    this.subs.sink = this.medpalService
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

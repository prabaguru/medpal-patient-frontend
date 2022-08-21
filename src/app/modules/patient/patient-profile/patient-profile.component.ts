import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit {
  //public enableLoader = false;
  public displayImgData = { image: '', imageFileName: '' };
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public PhoneNumberFormat = PhoneNumberFormat;
  public preferredCountries: CountryISO[] = [
    CountryISO.India,
    // CountryISO.UnitedArabEmirates,
    // CountryISO.UnitedStates,
    // CountryISO.UnitedKingdom,
  ];
  public gender = '';
  public maritalStatus = '';
  public bloodGroup = '';
  public profileForm: FormGroup = new FormGroup({});
  currentUser: any;
  bloodGroupObj = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  submitted = false;
  percentDone?: any = 0;

  constructor(
    public commonService: CommonService,
    public healthService: MedpalService,
    private dialog: MatDialog,
    public datePipe: DatePipe,
    public authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
    console.log(this.currentUser);

    this.profileForm = new FormGroup({
      id: new FormControl(this.currentUser._id ? this.currentUser._id : '', [
        Validators.required,
      ]),
      firstName: new FormControl(
        this.currentUser.firstName ? this.currentUser.firstName : '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]
      ),
      lastName: new FormControl(
        this.currentUser.lastName ? this.currentUser.lastName : '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]
      ),
      email: new FormControl(this.currentUser.email, [
        Validators.required,
        Validators.email,
      ]),
      gender: new FormControl(this.currentUser.gender),
      dob: new FormControl(this.currentUser.dob),
      mobile: new FormControl(
        { value: this.currentUser.mobile, disabled: true },
        [Validators.required, Validators.maxLength(15)]
      ),
      EmergencyContactNo: new FormControl(this.currentUser.EmergencyContactNo, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      Maritalstatus: new FormControl(this.currentUser.Maritalstatus),
      bloodGroup: new FormControl(this.currentUser.bloodGroup),
      AadhaarNo: new FormControl(this.currentUser.AadhaarNo, [
        Validators.minLength(12),
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(12),
      ]),
      pinCode: new FormControl(this.currentUser.pinCode, [
        Validators.maxLength(10),
      ]),
      address: new FormControl(this.currentUser.address, [
        Validators.maxLength(200),
      ]),
    });
  }
  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
    this.displayImgData = {
      image: this.currentUser.image.imageUrl
        ? this.currentUser.image.imageUrl
        : null,
      imageFileName: this.currentUser.image.imageName
        ? this.currentUser.image.imageName
        : null,
    };
  }
  resetmobilefield() {
    if (this.profileForm.controls.mobile.value) {
      this.profileForm.controls.mobile.setValue('');
    }
  }
  resetmobilefield1() {
    if (this.profileForm.controls.EmergencyContactNo.value) {
      this.profileForm.controls.EmergencyContactNo.setValue('');
    }
  }
  onImageSelected(event: any) {
    if (event.target.files[0].size / 1024 / 1024 > 1) {
      this.commonService.showNotification('Image size must be less than 1MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.displayImgData = {
        image: e.target.result,
        imageFileName: event.target.files[0].name,
      };
    };
    reader.readAsDataURL(event.target.files[0]);
    this.UploadImage(this.currentUser._id, event.target.files[0]);
  }
  UploadImage(id: any, img: any) {
    let imgUnlink = this.currentUser.image.imageName
      ? this.currentUser.image.imageName
      : null;

    this.healthService.uploadImage(id, img, imgUnlink).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            //console.log("Request has been made!");
            break;
          case HttpEventType.ResponseHeader:
            //console.log("Response header has been received!");
            break;
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.percentDone = Math.round((event.loaded / event.total) * 100);
            }
            //console.log(`Uploaded! ${this.percentDone}%`);
            break;
          case HttpEventType.Response:
            //console.log("Upload successfull!", event.body.result);
            this.commonService.showNotification(
              'Image uploaded successfully...'
            );
            let image = {};
            image = { image: event.body.result };
            this.percentDone = false;
            this.updateCurrentUserData(image);
        }
      },
      (error) => {
        this.percentDone = false;
        this.commonService.showNotification(error);
      }
    );
  }

  saveChanges() {
    this.submitted = true;
    if (this.f['email'].value == '') {
      this.commonService.showNotification('Update email address...');
      return;
    }
    if (this.profileForm.invalid) {
      return;
    }

    //this.enableLoader = true;
    const postData = this.profileForm.value;

    this.healthService.updatePatientProfile(postData).subscribe({
      next: (data: any) => {
        //this.enableLoader = false;
        this.dialog.open(PopupComponent, {
          minWidth: '20vw',
          data: {
            successIcon: true,
            content: 'Profile Updated Successfully!',
            isAlert: true,
          },
          autoFocus: false,
        });
        this.submitted = false;
        this.updateCurrentUserData(this.profileForm.value);
        //this.commonService.updateCurrentUser(this.currentUser);
        //this.commonService.updateProfileImg();
      },
      error: (err) => {
        //this.enableLoader = false;
        this.submitted = false;
        this.commonService.showNotification(err);
      },
    });
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
    this.currentUser = [];
    this.currentUser = this.authService.currentUserValue;
  }
}

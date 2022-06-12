import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit {
  public enableLoader = false;
  public displayImgData = { image: '', imageFileName: '' };
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public PhoneNumberFormat = PhoneNumberFormat;
  public preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  public gender = '';
  public maritalStatus = '';
  public bloodGroup = '';
  public profileForm: FormGroup = new FormGroup({});
  currentUser: any;

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
      id: new FormControl(this.currentUser._id ? this.currentUser._id : ''),
      firstName: new FormControl(
        this.currentUser.firstName ? this.currentUser.firstName : ''
      ),
      email: new FormControl(this.currentUser.email, [
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      gender: new FormControl(this.currentUser.gender),
      dob: new FormControl(this.currentUser.dob),
      mobile: new FormControl(this.currentUser.mobile, [
        Validators.maxLength(10),
      ]),
      EmergencyContactNo: new FormControl(this.currentUser.EmergencyContactNo, [
        Validators.maxLength(10),
      ]),
      Maritalstatus: new FormControl(this.currentUser.Maritalstatus),
      bloodGroup: new FormControl(this.currentUser.bloodGroup),
      AadhaarNo: new FormControl(this.currentUser.AadhaarNo),
      pinCode: new FormControl(this.currentUser.pinCode),
      address: new FormControl(this.currentUser.address),
    });
  }

  ngOnInit(): void {
    this.gender = this.currentUser.gender;
    this.bloodGroup = this.currentUser.bloodGroup;
    this.maritalStatus = this.currentUser.Maritalstatus;
    this.displayImgData.image = this.currentUser.image.imageUrl
      ? this.currentUser.image.imageUrl
      : 'assets/images/dummy.jpg';
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (event.target.files[0].size / 1024 / 1024 > 1) {
        alert('Image size must not be more than 1MB.');
        return;
      }
      this.displayImgData = {
        image: e.target.result,
        imageFileName: event.target.files[0].name,
      };
    };
    reader.readAsDataURL(event.target.files[0]);
  }
  saveChanges() {
    this.enableLoader = true;
    const postData = this.profileForm.value;
    // postData.dob = this.datePipe.transform(this.currentUser.dob, 'MM/dd/YYYY');
    // postData.image = { imageUrl: this.displayImgData.image };
    this.healthService.updatePatientProfile(postData).subscribe({
      next: (data: any) => {
        this.enableLoader = false;
        this.dialog.open(PopupComponent, {
          minWidth: '20vw',
          data: {
            successIcon: true,
            content: 'Profile Updated Successfully!',
            isAlert: true,
          },
          autoFocus: false,
        });
        this.updateCurrentUserData(this.profileForm.value);
        //this.commonService.updateCurrentUser(this.currentUser);
        //this.commonService.updateProfileImg();
      },
      error: (err) => {
        this.enableLoader = false;
        this.commonService.showNotification(err.message);
      },
    });
  }
  updateCurrentUserData(data: any) {
    const postDatas = Object.entries(data);
    postDatas.forEach((attribute: any) => {
      this.currentUser[attribute[0]] = attribute[1];
    });
  }
}

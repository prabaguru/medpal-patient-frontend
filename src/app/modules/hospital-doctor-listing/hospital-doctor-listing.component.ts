import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SPECIALISATION } from '../../dropdwndata';
declare var $: any;
@Component({
  selector: 'hospital-doctor-listing',
  templateUrl: './hospital-doctor-listing.component.html',
  styleUrls: ['./hospital-doctor-listing.component.scss'],
})
export class HospitalDoctorsListingComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  firstFormGroup: FormGroup;
  public inputToChild: any;
  doctorsListing = [];
  maindoctorsArr = [];
  options: any = {};
  public lat: number = 0;
  public lng: number = 0;
  params: any = null;
  gender = ['Male', 'Female', 'Show All'];
  docSpl = SPECIALISATION;
  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    super();

    this.subs.sink = this.route.queryParams.subscribe((p) => {
      this.params = p ? p : null;
    });
    this.firstFormGroup = this._formBuilder.group({
      genderFltr: [],
      splFilter: [''],
    });
  }

  ngOnInit(): void {
    //this.getLocation();
    this.params?.hid
      ? this.getHospitalDoctorsLIsting(this.params?.hid)
      : this.router.navigate(['/home']);
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  getHospitalDoctorsLIsting(hid: any) {
    this.subs.sink = this.medpalService
      .getHospitalDoctorsLIsting(hid)
      .subscribe({
        next: (data: any) => {
          this.doctorsListing = [];
          this.maindoctorsArr = [];
          this.maindoctorsArr = data;
          this.doctorsListing = data;
          //console.log(this.doctorsListing);
        },
        error: (err) => {
          this.commonService.showNotification(err);
        },
      });
  }
  applyFilter(filter: String) {
    if (filter === 'Show All') {
      this.f['genderFltr'].setValue(null);
      this.doctorsListing = this.maindoctorsArr;
    } else {
      this.doctorsListing = this.maindoctorsArr.filter(
        (obj: any) => obj.gender == filter
      );
    }
    this.f['splFilter'].setValue('');
  }
  applySpecialisationFilter(filter: String) {
    let gender =
      this.f['genderFltr'].value === 'Show All'
        ? null
        : this.f['genderFltr'].value;
    if (filter === 'MBBS - General') {
      if (filter && !gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.qualificationUG.sName == 'MBBS' &&
            obj.graduation.Graduation === 'UG'
        );
      }
      if (filter && gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.qualificationUG.sName == 'MBBS' &&
            obj.graduation.Graduation === 'UG' &&
            obj.gender === gender
        );
      }
    } else {
      if (filter && !gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) => obj.graduation.specialisationPG.name === filter
        );
      }
      if (filter && gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.specialisationPG.name === filter &&
            obj.gender === gender
        );
      }
    }
  }

  public AddressChange(address: any) {
    console.log(address);
    this.lng = 0;
    this.lat = 0;
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    console.log('Latitude: ' + this.lat + 'Longitude: ' + this.lng);
    let obj = {};
    obj = {
      lng: this.lng,
      lat: this.lat,
    };
    //this.geoQueryDoctors(obj);
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            console.log(
              'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude
            );
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            let obj = {};
            obj = {
              lat: this.lat,
              lng: this.lng,
            };
            this.geoQueryDoctors(obj);
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      this.lat = 0;
      this.lng = 0;
    }
  }

  geoQueryDoctors(obj: any) {
    this.subs.sink = this.medpalService.getDoctorsLIstingGeo(obj).subscribe({
      next: (data: any) => {
        this.doctorsListing = [];
        this.doctorsListing = data;
        // console.log(this.doctorsListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  openModal(data: any, cli: any) {
    this.inputToChild = null;
    let obj = {};
    if (cli === 'clinic1') {
      data['clinic1'] = true;
      data['clinic2'] = false;
      obj = {
        mainObj: data,
        clicnicData: data.ClinicOneTimings,
      };
    }
    if (cli === 'clinic2') {
      data['clinic1'] = false;
      data['clinic2'] = true;
      obj = {
        mainObj: data,
        clicnicData: data.ClinicTwoTimings,
      };
    }
    this.inputToChild = obj;

    setTimeout(function () {
      $('#staticBackdropAppointments').modal('show');
    }, 500);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

declare var $: any;
@Component({
  selector: 'doctors-listing',
  templateUrl: './doctors-listing.component.html',
  styleUrls: ['./doctors-listing.component.scss'],
})
export class DoctorsListingComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public inputToChild: any;
  doctorsListing = [];
  maindoctorsArr = [];
  options: any = {};
  public lat: number = 0;
  public lng: number = 0;
  params: any = null;
  locationText: boolean = false;
  gender = ['Show All', 'Male', 'Female'];
  docSpl: any = [
    {
      id: '0',
      name: 'MBBS - General',
    },
  ];
  docType: any = [
    {
      id: '1',
      name: 'Allopathy',
    },
  ];
  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    super();

    this.options = {
      bounds: undefined,
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      strictBounds: false,
      types: [],
      componentRestrictions: { country: 'in' },
    };
    this.firstFormGroup = this._formBuilder.group({
      addSearch: [],
    });
    this.secondFormGroup = this._formBuilder.group({
      genderFltr: [],
      splFilter: [''],
      dtFilter: [''],
    });
  }

  ngOnInit(): void {
    //this.getLocation();
    this.getdocListing();
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  get g() {
    return this.secondFormGroup.controls;
  }
  getdocListing() {
    this.subs.sink = this.medpalService.getDoctorsLIsting().subscribe({
      next: (data: any) => {
        this.doctorsListing = [];
        if (data.length > 0) {
          this.doctorsListing = data.sort(
            (a: any, b: any) =>
              Number(b.graduation.overallExperience) -
              Number(a.graduation.overallExperience)
          );
        } else {
          this.doctorsListing = [];
        }
        //console.log(this.doctorsListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
  }

  public AddressChange(address: any) {
    //console.log(address);
    this.lng = 0;
    this.lat = 0;
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    //console.log('Latitude: ' + this.lat + 'Longitude: ' + this.lng);
    let obj = {};
    obj = {
      lng: this.lng,
      lat: this.lat,
    };
    this.geoQueryDoctors(obj);
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            // console.log(position);
            // console.log(
            //   'Latitude: ' +
            //     position.coords.latitude +
            //     'Longitude: ' +
            //     position.coords.longitude
            // );
            this.lat = position.coords.latitude - 1.1676886;
            this.lng = position.coords.longitude - 0.4022846;
            let obj = {};
            obj = {
              lng: this.lng,
              lat: this.lat,
            };
            this.geoQueryDoctors(obj);
          }
        },
        (error: any) => {
          //console.log(error);
          this.commonService.showNotification(
            "We can't detect Your Location. Search Your location in the search section."
          );
        },
        { enableHighAccuracy: true, timeout: 10 * 1000, maximumAge: 0 }
      );
    } else {
      this.lat = 0;
      this.lng = 0;
    }
    this.firstFormGroup.reset();
  }

  geoQueryDoctors(obj: any) {
    this.subs.sink = this.medpalService.getDoctorsLIstingGeo(obj).subscribe({
      next: (data: any) => {
        this.doctorsListing = [];
        this.maindoctorsArr = [];

        if (data.length > 0) {
          this.maindoctorsArr = data.sort(
            (a: any, b: any) =>
              Number(b.graduation.overallExperience) -
              Number(a.graduation.overallExperience)
          );
          this.doctorsListing = this.maindoctorsArr;
          this.locationText = true;
          let len = this.doctorsListing.length;
          for (let i = 0; i < len; i++) {
            if (data[i].graduation.specialisationPG) {
              this.docSpl.push(data[i].graduation.specialisationPG);
            }
            if (data[i].graduation.DoctorType) {
              this.docType.push(data[i].graduation.DoctorType);
            }
          }
          this.docSpl = this.filterDuplicates(this.docSpl, false);
          this.docType = this.filterDuplicates(this.docType, true);
        } else {
          this.doctorsListing = [];
        }
        // console.log(this.doctorsListing);
      },
      error: (err) => {
        this.locationText = false;
        this.commonService.showNotification(err);
      },
    });
  }
  clearSearch() {
    this.firstFormGroup.reset();
  }
  filterDuplicates(arr: any, sort: boolean) {
    let data = arr.reduce((acc: any, current: any) => {
      let x = acc.find((item: any) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    if (!sort) {
      return data;
    } else {
      return data.sort(function (a: any, b: any) {
        return a.name.localeCompare(b.name);
      });
    }
  }
  //Doc Filters
  docTypeFilter(filter: String) {
    if (filter !== 'Show All') {
      this.doctorsListing = this.maindoctorsArr.filter(
        (obj: any) => obj.graduation.DoctorType.name == filter
      );
    } else {
      this.doctorsListing = this.maindoctorsArr;
    }
    this.g['genderFltr'].setValue('');
    this.g['splFilter'].setValue('');
  }
  applyFilter(filter: String) {
    let docType = this.g['dtFilter'].value;
    if (filter === 'Show All') {
      if (docType) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) => obj.graduation.DoctorType.name == docType
        );
      } else {
        this.doctorsListing = this.maindoctorsArr;
      }
    } else {
      if (docType) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.gender == filter && obj.graduation.DoctorType.name == docType
        );
      } else {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) => obj.gender == filter
        );
      }
    }
    this.g['splFilter'].setValue('');
  }
  applySpecialisationFilter(filter: String) {
    let gender =
      this.g['genderFltr'].value === 'Show All'
        ? null
        : this.g['genderFltr'].value;
    if (filter === 'MBBS - General') {
      if (filter && !gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.qualificationUG.sName == 'MBBS' &&
            obj.graduation.Graduation === 'UG' &&
            obj.graduation.DoctorType.name === 'Allopathy'
        );
      }
      if (filter && gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.qualificationUG.sName == 'MBBS' &&
            obj.graduation.Graduation === 'UG' &&
            obj.gender === gender &&
            obj.graduation.DoctorType.name === 'Allopathy'
        );
      }
    } else {
      if (filter && !gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.specialisationPG.name === filter &&
            obj.graduation.DoctorType.name === 'Allopathy'
        );
      }
      if (filter && gender) {
        this.doctorsListing = this.maindoctorsArr.filter(
          (obj: any) =>
            obj.graduation.specialisationPG.name === filter &&
            obj.gender === gender &&
            obj.graduation.DoctorType.name === 'Allopathy'
        );
      }
    }
  }
  mainReset() {
    this.secondFormGroup.reset();
    this.doctorsListing = this.maindoctorsArr;
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

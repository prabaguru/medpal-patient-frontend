import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  public inputToChild: any;
  doctorsListing = [];
  options: any = {};
  public lat: number = 0;
  public lng: number = 0;
  params: any = null;
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
  }

  ngOnInit(): void {
    //this.getLocation();
    this.getdocListing();
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  getdocListing() {
    this.subs.sink = this.medpalService.getDoctorsLIsting().subscribe({
      next: (data: any) => {
        this.doctorsListing = [];
        this.doctorsListing = data;
        //console.log(this.doctorsListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
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
    this.geoQueryDoctors(obj);
  }
  getLocation() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            //console.log(position);
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
              lng: this.lng,
              lat: this.lat,
            };
            this.geoQueryDoctors(obj);
          }
        },
        (error: any) => console.log(error),
        { enableHighAccuracy: true }
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
        this.doctorsListing = data;
        // console.log(this.doctorsListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
  }
  clearSearch() {
    this.firstFormGroup.reset();
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

import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

declare var $: any;
@Component({
  selector: 'doctors-listing',
  templateUrl: './doctors-listing.component.html',
  styleUrls: ['./doctors-listing.component.scss'],
})
export class DoctorsListingComponent implements OnInit {
  //public enableLoader = false;
  public inputToChild: any;
  doctorsListing = [];
  options: any = {};
  public lat: number = 0;
  public lng: number = 0;
  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService
  ) {
    const center = { lat: 12.972442, lng: 77.580643 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    this.options = {
      bounds: undefined,
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      strictBounds: false,
      types: [],
      componentRestrictions: { country: 'in' },
    };
  }

  ngOnInit(): void {
    //this.getLocation();
    this.medpalService.getDoctorsLIsting().subscribe({
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
    this.medpalService.getDoctorsLIstingGeo(obj).subscribe({
      next: (data: any) => {
        this.doctorsListing = [];
        this.doctorsListing = data;
        console.log(this.doctorsListing);
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

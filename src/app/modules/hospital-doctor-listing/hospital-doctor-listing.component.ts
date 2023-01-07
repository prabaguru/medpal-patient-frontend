import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
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
  //public enableLoader = false;
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
    private router: Router
  ) {
    super();
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
    this.subs.sink = this.route.queryParams.subscribe((p) => {
      this.params = p ? p : null;
    });
  }

  ngOnInit(): void {
    //this.getLocation();
    this.params?.hid
      ? this.getHospitalDoctorsLIsting(this.params?.hid)
      : this.router.navigate(['/home']);
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
  getHospitalDoctorsLIsting(hid: any) {
    this.subs.sink = this.medpalService
      .getHospitalDoctorsLIsting(hid)
      .subscribe({
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

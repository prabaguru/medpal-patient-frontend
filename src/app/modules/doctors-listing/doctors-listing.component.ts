import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';

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
  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService
  ) {}

  ngOnInit(): void {
    this.medpalService.getDoctorsLIsting().subscribe({
      next: (data: any) => {
        this.doctorsListing = data;
        //console.log(this.doctorsListing);
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

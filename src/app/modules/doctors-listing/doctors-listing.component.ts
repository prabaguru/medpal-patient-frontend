import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
@Component({
  selector: 'doctors-listing',
  templateUrl: './doctors-listing.component.html',
  styleUrls: ['./doctors-listing.component.scss'],
})
export class DoctorsListingComponent implements OnInit {
  //public enableLoader = false;
  doctorsListing = [];
  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService
  ) {}

  ngOnInit(): void {
    this.medpalService.getDoctorsLIsting().subscribe({
      next: (data: any) => {
        this.doctorsListing = data;
        console.log(this.doctorsListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
  }
}

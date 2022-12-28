import { Component, OnInit } from '@angular/core';
import { AuthService, MedpalService, CommonService } from 'src/app/services';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
@Component({
  selector: 'app-medpal-home',
  templateUrl: './medpal-home.component.html',
  styleUrls: ['./medpal-home.component.scss'],
})
export class MedpalHomeComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  currentUser: any;
  isLoggenIn: boolean = false;
  hospitalListing = [];
  constructor(
    public authService: AuthService,
    public medpalService: MedpalService,
    public commonService: CommonService
  ) {
    super();
    this.currentUser = null;
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.currentUser?.token
        ? (this.isLoggenIn = true)
        : (this.isLoggenIn = false);
    });
  }

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.getHospitalList();
  }

  getHospitalList() {
    this.subs.sink = this.medpalService.getHospitalsLIsting().subscribe({
      next: (data: any) => {
        this.hospitalListing = [];
        this.hospitalListing = data;
        //console.log(this.hospitalListing);
      },
      error: (err) => {
        this.commonService.showNotification(err);
      },
    });
  }
}

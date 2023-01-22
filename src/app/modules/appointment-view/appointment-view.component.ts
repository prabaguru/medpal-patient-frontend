import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
(moment as any).suppressDeprecationWarnings = true;
@Component({
  selector: 'app-patient-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss'],
})
export class AppointmentViewComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  appoinmentDetails: any;
  appId: any;

  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.subs.sink = this.route.queryParams.subscribe((p) => {
      this.appId = p['id'];
    });
  }

  ngOnInit(): void {
    this.appId ? this.getapp(this.appId) : this.router.navigate(['/home']);
  }

  getapp(id: any) {
    this.subs.sink = this.medpalService.getAppById(id).subscribe({
      next: (data: any) => {
        //console.log(data);
        if (data.length == 0) {
          this.router.navigate(['/home']);
        }
        this.appoinmentDetails = data[0];
        let tstamp = parseInt(this.appoinmentDetails.appointmentDate);
        let datecheck = moment.unix(tstamp);
        let dateDiff = moment().diff(datecheck, 'days');
        //console.log(dateDiff);
        if (dateDiff >= 2) {
          this.commonService.showNotification('This Appointment is closed.');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        //this.commonService.showNotification(err);
      },
    });
  }
}

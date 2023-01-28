import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService } from 'src/app/services';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
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
  cancel: boolean = true;

  constructor(
    public commonService: CommonService,
    public medpalService: MedpalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.subs.sink = this.route.queryParams.subscribe((p) => {
      this.appId = p['id'];
      this.cancel = p['cancel'] ? p['cancel'] : true;
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

  cancelAppointment(aId: any) {
    let obj = {};
    obj = {
      id: aId._id,
      AppointmentStatus: 'Cancelled',
      closedBy: 'Doctor',
      slot: `${aId.slot}-Cancelled`,
      appointmentDate: aId.appointmentDate,
      updateType: 'Cancel',
    };
    let curTime = moment().unix();
    if (aId.appointmentDate < curTime) {
      this.commonService.showNotification(
        'Slot time has expired.This appointment cannot be cancelled.'
      );
      this.cancel = false;
      return;
    }
    this.subs.sink = this.medpalService
      .closeDoctorappointment(obj)
      .pipe(first())
      .subscribe({
        next: () => {
          this.commonService.showNotification(
            'Appointment cancelled sucessfully.'
          );
        },
        error: (error: any) => {
          this.commonService.showNotification(error);
          this.cancel = false;
          this.router.navigate(['/appointment'], {
            queryParams: { id: this.appId, cancel: this.cancel },
          });
        },
        complete: () => {},
      });
  }
}

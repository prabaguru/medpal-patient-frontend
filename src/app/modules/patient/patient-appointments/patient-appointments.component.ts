import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { first } from 'rxjs/operators';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'patient-appointments-component',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PatientAppointmentsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  //@ViewChild(MatSort, { static: false }) sort!: MatSort;
  submitted = false;
  currentUser: any;
  getAppointments = [];
  dataSource: any = [];
  columnsToDisplay = ['doctorName', 'bookedDate', 'AppointmentStatus'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any;
  getAppointmentsflag: boolean = false;
  constructor(
    private router: Router,
    private healthService: MedpalService,
    public authService: AuthService,
    public commonService: CommonService,
    public medpalService: MedpalService
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.getAppointmentsById();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  getAppointmentsById() {
    this.getAppointments = [];
    let userId = '';
    userId = this.currentUser._id;
    if (!userId) {
      return;
    }
    let obj: any = {
      id: userId,
    };
    this.medpalService
      .getAppointmentsById(obj)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.getAppointments = data;
          if (this.getAppointments.length > 0) {
            this.dataSource = new MatTableDataSource(this.getAppointments);
            //this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.getAppointmentsflag = false;
          } else {
            this.getAppointmentsflag = true;
          }
          //console.log(this.getAppointments);
        },
        (error) => {
          this.commonService.showNotification(error);
          this.getAppointmentsflag = false;
        }
      );
  }
}

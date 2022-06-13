import { Component, OnInit } from '@angular/core';
import { CommonService, MedpalService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-patient-menu',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.scss'],
})
export class PatientHomeComponent implements OnInit {
  public enableLoader = false;
  currentUser: any;

  constructor(
    public commonService: CommonService,
    public authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {}
}

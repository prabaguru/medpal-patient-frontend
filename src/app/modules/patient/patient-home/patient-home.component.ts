import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.scss']
})
export class PatientHomeComponent implements OnInit {

  @ViewChild('menuTrigger') trigger: any;  
  @ViewChild('login') matMenuPanel: any;
  enteredButton = false;
  imageSrc = '';
  userName = '';
  country = 'India';
  sideNavMenu: any = [];
  memberId = 'PAT-12345';
  currentUser: any;

  constructor(public commonService: CommonService) {
    this.currentUser = this.commonService.currentUserData;
    this.commonService.imgChange.subscribe(() => {
      this.imageSrc = this.currentUser.image.imageUrl ? this.currentUser.image.imageUrl : 'assets/images/dummy.jpg';
    });
  }

  ngOnInit(): void {
    this.userName = this.currentUser.firstName; //'Priya Mani'
    this.imageSrc = this.currentUser.image.imageUrl ? this.currentUser.image.imageUrl : 'assets/images/dummy.jpg';
    this.sideNavMenu = [
      { name: 'Personal Info', state: 'profile', icon: 'settings_accessibility' },
      { name: 'Dashboard', state: 'dashboard', icon: 'dashboard' },
      { name: 'Family Members', state: 'family', icon: 'people_outline' },
      { name: 'History', state: 'history', icon: 'history' },
      { name: 'Files', state: 'files', icon: 'attachments' },
      { name: 'Payment Methods', state: 'payments', icon: 'payments' },
      { name: 'Favorites Doctors', state: 'favorites', icon: 'favorite_border' },
    ]
  }

  logOut() {
    //
  }

}

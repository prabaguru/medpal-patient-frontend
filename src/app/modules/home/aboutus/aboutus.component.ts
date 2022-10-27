import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-medpal-about',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class MedpalAboutUsComponent implements OnInit {
  currentUser: any;
  isLoggenIn: boolean = false;
  constructor() {}

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}

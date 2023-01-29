import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-medpal-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
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

import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-medpal-termsnconditions',
  templateUrl: './termsnconditions.component.html',
  styleUrls: ['./termsnconditions.component.scss'],
})
export class TermsnConditionsComponent implements OnInit {
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

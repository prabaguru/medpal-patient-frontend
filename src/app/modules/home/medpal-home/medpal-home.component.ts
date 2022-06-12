import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medpal-home',
  templateUrl: './medpal-home.component.html',
  styleUrls: ['./medpal-home.component.scss'],
})
export class MedpalHomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}

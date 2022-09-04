import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
@Component({
  selector: 'app-medpal-home',
  templateUrl: './medpal-home.component.html',
  styleUrls: ['./medpal-home.component.scss'],
})
export class MedpalHomeComponent implements OnInit {
  currentUser: any;
  isLoggenIn: boolean = false;
  constructor(public authService: AuthService) {
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
  }
}

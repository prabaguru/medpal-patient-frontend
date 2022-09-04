import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: any = {};
  isLoggenIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      this.currentUser?.token
        ? (this.isLoggenIn = true)
        : (this.isLoggenIn = false);
    });
  }

  ngOnInit(): void {}
  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/medpal/home']);
      }
      this.isLoggenIn = false;
    });
  }
}

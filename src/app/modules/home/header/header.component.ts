import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any = {};
  isLoggenIn: boolean = false;
  private subscriptions = new Subscription();
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
    this.subscriptions.add(
      this.authService.logout().subscribe((res) => {
        if (!res.success) {
          this.router.navigate(['/home']);
        }
        this.isLoggenIn = false;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

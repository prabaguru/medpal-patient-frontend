import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, MedpalService, AuthService } from 'src/app/services';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.scss'],
})
export class PatientLoginComponent implements OnInit {
  enableLoader = false;
  returnUrl: any;
  userEmail: any;
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private healthService: MedpalService,
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.router.snapshot.queryParams['email'] || '';
    this.returnUrl = this.router.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.currentUserValue) {
      this.route.navigate(['/medpal'], {
        queryParams: { returnUrl: this.returnUrl },
      });
    }

    this.loginForm = new FormGroup({
      email: new FormControl(this.userEmail ? this.userEmail : '', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
  rememberMe() {
    // checked data here
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.enableLoader = true;

    this.authService
      .login(
        this.loginForm.controls['email'].value,
        this.loginForm.controls['password'].value
      )
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.route.navigate(['medpal/patient/profile']);
              this.commonService.showNotification(`Welcome ${res.firstName}!`);
            }
          } else {
            this.enableLoader = false;
            this.route.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.enableLoader = false;
          this.commonService.showNotification(error);
        },
        complete: () => {},
      });
  }
}

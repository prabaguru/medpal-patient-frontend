import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { MedpalService } from 'src/app/services/medpal.service';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.scss']
})
export class PatientLoginComponent implements OnInit {

  enableLoader = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required]),
  });
  
  constructor(private router: Router, private healthService: MedpalService, public commonService: CommonService) {}

  ngOnInit(): void {
  }
  rememberMe() {
    // checked data here
  }

  login(): void {
    if (this.loginForm.invalid) { return; }
    this.enableLoader = true;
    this.healthService.patientLogin(this.loginForm.value).subscribe({
      next: (data: any) => {
        this.enableLoader = false;
        this.commonService.updateCurrentUser(data);
        this.router.navigate(['medpal-patient']);
        this.commonService.showNotification(`Welcome ${data.firstName}!`);
      }, error: (err) => {
        this.enableLoader = false;
        this.commonService.showNotification(err.message);
      }
    })
  }
}

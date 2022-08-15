import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './modules/home/header/header.component';
import { MedpalHomeComponent } from './modules/home/medpal-home/medpal-home.component';
import { PatientLoginComponent } from './modules/login/patient-login/patient-login.component';
import { PatientSignupComponent } from './modules/login/patient-signup/patient-signup.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';
import { ResetPasswordEmailComponent } from './modules/login/reset-password-email/reset-password-email.component';
import { PatientProfileResetPasswordComponent } from './modules/patient/patient-reset-password/patient-reset-password.component';
import { PatientProfileComponent } from './modules/patient/patient-profile/patient-profile.component';
import { DoctorsListingComponent } from './modules/doctors-listing/doctors-listing.component';
import { DoctorsProfileComponent } from './modules/doctors-profile/doctors-profile.component';
import { AppointmentsComponent } from './modules/appointments/appointments.component';
import { AuthGuard } from './services';

const routes: Routes = [
  { path: '', redirectTo: 'medpal', pathMatch: 'full' },
  {
    path: 'medpal',
    component: HeaderComponent,

    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: MedpalHomeComponent,
      },
      {
        path: 'doctors-listing/doctors',
        component: DoctorsListingComponent,
      },
      {
        path: 'doctors-profile',
        component: DoctorsProfileComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'patient/login',
        component: PatientLoginComponent,
      },
      {
        path: 'patient/signup',
        component: PatientSignupComponent,
      },
      {
        path: 'patient/forget-password',
        component: ResetPasswordEmailComponent,
      },
      {
        path: 'patient/reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'patient/profile',
        component: PatientProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'patient/profile-reset-password',
        component: PatientProfileResetPasswordComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // {
  //   path: 'medpal-patient',
  //   component: PatientHomeComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'profile',
  //       pathMatch: 'full',
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

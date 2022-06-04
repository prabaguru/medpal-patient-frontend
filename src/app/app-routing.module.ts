import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './modules/home/header/header.component';
import { MedpalHomeComponent } from './modules/home/medpal-home/medpal-home.component';
import { PatientLoginComponent } from './modules/login/patient-login/patient-login.component';
import { PatientSignupComponent } from './modules/login/patient-signup/patient-signup.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';
import { PatientHomeComponent } from './modules/patient/patient-home/patient-home.component';
import { PatientProfileComponent } from './modules/patient/patient-profile/patient-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'medpal', pathMatch: 'full'},
  { path: 'medpal',
    component: HeaderComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: MedpalHomeComponent
      },
      {
        path: 'patient/login',
        component: PatientLoginComponent
      },
      {
        path: 'patient/login',
        component: PatientLoginComponent
      },
      {
        path: 'patient/signup',
        component: PatientSignupComponent
      },
      {
        path: 'forget-password',
        component: ResetPasswordComponent
      },
    ]
  },
  { path: 'medpal-patient',
    component: PatientHomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: PatientProfileComponent
      },
      {
        path: 'patient/login',
        component: PatientLoginComponent
      },
      {
        path: 'patient/signup',
        component: PatientSignupComponent
      },
      {
        path: 'forget-password',
        component: ResetPasswordComponent
      },
    ]
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

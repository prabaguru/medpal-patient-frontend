import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgHttpLoaderModule } from 'ng-http-loader';

import { HeaderComponent } from './modules/home/header/header.component';
import { FooterComponent } from './modules/home/footer/footer.component';
import { PatientLoginComponent } from './modules/login/patient-login/patient-login.component';
import { PatientSignupComponent } from './modules/login/patient-signup/patient-signup.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';
import { ResetPasswordEmailComponent } from './modules/login/reset-password-email/reset-password-email.component';
import { AngularMaterialModule } from './shared/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OtpVerifyComponent } from './shared/components/otp-verify/otp-verify.component';
import { PopupComponent } from './shared/components/popup/popup.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PatientHomeComponent } from './modules/patient/patient-home/patient-home.component';
import { PatientProfileComponent } from './modules/patient/patient-profile/patient-profile.component';
import { MedpalHomeComponent } from './modules/home/medpal-home/medpal-home.component';
import { DoctorsListingComponent } from './modules/doctors-listing/doctors-listing.component';
import { PatientProfileResetPasswordComponent } from './modules/patient/patient-reset-password/patient-reset-password.component';
import {
  MedPalHttpInterceptor,
  ErrorInterceptor,
  AuthGuard,
} from './services/';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PatientLoginComponent,
    PatientSignupComponent,
    ResetPasswordComponent,
    ResetPasswordEmailComponent,
    OtpVerifyComponent,
    PopupComponent,
    PatientHomeComponent,
    PatientProfileComponent,
    MedpalHomeComponent,
    PatientProfileResetPasswordComponent,
    DoctorsListingComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    NgxIntlTelInputModule,
    AppRoutingModule,
    NgHttpLoaderModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatePipe,
    AuthGuard,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MedPalHttpInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { HeaderComponent } from './modules/home/header/header.component';
import { FooterComponent } from './modules/home/footer/footer.component';
import { PatientLoginComponent } from './modules/login/patient-login/patient-login.component';
import { PatientSignupComponent } from './modules/login/patient-signup/patient-signup.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';
import { AngularMaterialModule } from './shared/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OtpVerifyComponent } from './shared/components/otp-verify/otp-verify.component';
import { PopupComponent } from './shared/components/popup/popup.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PatientProfileComponent } from './modules/patient/patient-profile/patient-profile.component';
import { PatientHomeComponent } from './modules/patient/patient-home/patient-home.component';
import { MedpalHomeComponent } from './modules/home/medpal-home/medpal-home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PatientLoginComponent,
    PatientSignupComponent,
    ResetPasswordComponent,
    OtpVerifyComponent,
    PopupComponent,
    PatientProfileComponent,
    PatientHomeComponent,
    MedpalHomeComponent
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
    AppRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

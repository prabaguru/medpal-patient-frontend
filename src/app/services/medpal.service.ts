import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class MedpalService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* API call started from here */

  public bookAppointment(data: any) {
    return this.http
      .post(`${this.baseUrl}/patient_appointments/register`, data)
      .pipe(catchError(this.handleError));
  }

  public patientRegister(data: any) {
    return this.http
      .post(`${this.baseUrl}/patients/registerNLogin`, data)
      .pipe(catchError(this.handleError));
  }
  public patientCheckEmail(data: any) {
    return this.http
      .post(`${this.baseUrl}/patients/checkEmail`, data)
      .pipe(catchError(this.handleError));
  }
  public patientCheckMobile(data: any) {
    return this.http
      .post(`${this.baseUrl}/patients/CheckMobile`, data)
      .pipe(catchError(this.handleError));
  }
  public patientLogin(data: any) {
    return this.http
      .post(`${this.baseUrl}/patients/authenticate`, data)
      .pipe(catchError(this.handleError));
  }
  public updatePatientProfile(data: any) {
    return this.http
      .put(`${this.baseUrl}/patients/update`, data, {})
      .pipe(catchError(this.handleError));
  }
  public updatePatientFNE(data: any) {
    return this.http
      .put(`${this.baseUrl}/patients/updateUserFNE`, data, {})
      .pipe(catchError(this.handleError));
  }
  forgotPassWordSendEmail(data: any) {
    return this.http
      .post(`${this.baseUrl}/patients/forgotPasswordEmail`, data)
      .pipe(catchError(this.handleError));
  }
  updatePassword(data: any) {
    return this.http.put(`${this.baseUrl}/patients/changePassWord`, data);
  }
  public uploadImage(
    id: any,
    profileImage: File,
    imgUnlink: any
  ): Observable<any> {
    var formData: any = new FormData();
    formData.append('id', id);
    formData.append('file', profileImage);
    formData.append('imgUnlink', imgUnlink);
    return this.http.put(`${this.baseUrl}/patients/uploadPatientDP`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  getDoctorsLIsting() {
    return this.http.get(`${this.baseUrl}/doctors/getAll`);
  }

  getDoctorData(name: string) {
    const params = new HttpParams().append('name', name);
    return this.http.get(`${environment.apiUrl}/doctors/getByName`, {
      params,
    });
  }

  private handleError(err: any) {
    //console.log("error caught in service");
    //console.error(err);
    //Handle the error here
    return throwError(err);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedpalService {

  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient,) { }

  /* API call started from here */
  public patientRegister(data: any) {
    return this.http.post(`${this.baseUrl}api/patients/register`, data);
  }
  public patientLogin(data: any) {
    return this.http.post(`${this.baseUrl}api/patients/authenticate`, data);
  }
  public updatePatientProfile(data: any) {
    return this.http.put(`${this.baseUrl}api/patients/update`, data);
  }


}

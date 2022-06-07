import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  currentUserData: any;
  imgUpdate = new Subject();
  imgChange = this.imgUpdate.asObservable();

  constructor( public notification: MatSnackBar, public router: Router, private location: Location) {
    if (sessionStorage.getItem('loggedInUserData')) {
      this.currentUserData = JSON.parse(sessionStorage.getItem('loggedInUserData') as any);
    }
  }

  public updateProfileImg() {
    this.imgUpdate.next();
  }

  public updateCurrentUser(user: any) {    
    this.currentUserData = user;
    sessionStorage.setItem('loggedInUserData', JSON.stringify(user));
  }

  // Show notification on top of the screen
  public showNotification(message: any, duaration = 5000) {
    this.notification.open(message, 'Dismiss', {
      duration: duaration, verticalPosition: 'top', horizontalPosition: 'center'
    });
  }

  // Remove duplicates from object array.
  removeDuplicateFromArray(data: any, key: any) {
    return [
      ...new Map(data.map((x: any) => [key(x), x])).values()
    ];
  }

  // Convert string to base64
  public convertToBase64(inputValue: any): string {
    return btoa(inputValue); // JS built-in method for base64 conversion
  }

  // Refresh the same screen for data updation
  refresh(): void {
    this.router.navigateByUrl('**', { skipLocationChange: true }).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
    });
  }
  
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  currentUserData: any;

  constructor(
    public notification: MatSnackBar,
    public router: Router,
    private location: Location
  ) {}

  // Show notification on top of the screen
  public showNotification(message: any, duaration = 5000) {
    this.notification.open(message, 'Dismiss', {
      duration: duaration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['mat-toolbar'],
    });
  }

  // Remove duplicates from object array.
  removeDuplicateFromArray(data: any, key: any) {
    return [...new Map(data.map((x: any) => [key(x), x])).values()];
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

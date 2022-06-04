import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  public title = '';
  public content = '';
  public isAlert = false;
  public accept = 'OK';
  public cancel = 'Cancel';
  public successIcon = false;

  constructor(public dialogRef: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.title = data.title;
      this.content = data.content;
      this.isAlert = data.isAlert ? true : false;
      this.successIcon = data.successIcon ? true : false;
      if (data.accept) { this.accept = data.accept; }
    }
  }

  ngOnInit(): void {
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, MedpalService } from 'src/app/services';
@Component({
  templateUrl: './doctors-profile.component.html',
  styleUrls: ['./doctors-profile.component.scss'],
})
export class DoctorsProfileComponent implements OnInit {
  docName: string = '';
  doc: any = [];
  pushPage: boolean = false;
  zoom: number = 8;
  height = '100px';
  googleMapType = 'satellite';
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    public medpalService: MedpalService
  ) {
    this.route.queryParams.subscribe((p) => {
      this.docName = p['doctor'];
    });
    this.medpalService.getDoctorData(this.docName).subscribe({
      next: (data: any) => {
        this.doc = [];
        this.doc = data[0];
        this.pushPage = true;
        console.log(this.doc);
      },
      error: (err) => {
        this.pushPage = false;
        this.commonService.showNotification(err);
      },
    });
  }
  ngOnInit(): void {
    window.scroll(0, 0);
  }

  mapClicked(event: any) {}
}

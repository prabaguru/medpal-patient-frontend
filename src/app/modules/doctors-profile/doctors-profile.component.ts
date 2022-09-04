import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, MedpalService } from 'src/app/services';
declare var $: any;
@Component({
  templateUrl: './doctors-profile.component.html',
  styleUrls: ['./doctors-profile.component.scss'],
})
export class DoctorsProfileComponent implements OnInit {
  public inputToChild: any;
  docName: string = '';
  docId: string = '';
  doc: any = [];
  pushPage: boolean = false;
  zoom: number = 8;
  height = '100px';
  googleMapType = 'roadmap';
  obj: any;
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
      let doctype = null;
      let doc = null;
      if (p['doctor']) {
        this.docName = p['doctor'];
        doctype = 'Name';
        doc = this.docName;
      } else {
        this.docId = p['docId'];
        doctype = 'ID';
        doc = this.docId;
      }
      this.obj = {};
      this.obj = {
        getBy: doctype,
        getdoctor: doc,
      };
    });
    this.medpalService.getDoctorData(this.obj).subscribe({
      next: (data: any) => {
        this.doc = [];
        this.doc = data[0];
        this.pushPage = true;
        if (!this.doc) {
          this.commonService.showNotification('Doctor not found...');
          this.router.navigate(['/medpal/doctors-listing/doctors']);
        }
        //console.log(this.doc);
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

  openModal(data: any, cli: any) {
    this.inputToChild = null;
    let obj = {};
    if (cli === 'clinic1') {
      data['clinic1'] = true;
      data['clinic2'] = false;
      obj = {
        mainObj: data,
        clicnicData: data.ClinicOneTimings,
      };
    }
    if (cli === 'clinic2') {
      data['clinic1'] = false;
      data['clinic2'] = true;
      obj = {
        mainObj: data,
        clicnicData: data.ClinicTwoTimings,
      };
    }
    this.inputToChild = obj;

    setTimeout(function () {
      $('#staticBackdropAppointments').modal('show');
    }, 500);
  }
}

import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../services/globaldata.service';
import { replanAPIService } from '../../../services/replanAPI.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  currentIdProject: number = null;
  currentIdRelease: number = null;

  constructor(private globaldata: GlobalDataService,
              private _replanAPIService: replanAPIService,
              private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    this.deleteReleasePlan();
    this.currentIdProject = this.globaldata.getCurrentProjectId();
    this.router.navigate( ['/projects/', this.currentIdProject] );
  }

  goToProjectSettings() {
    this.deleteReleasePlan();
    this.currentIdProject = this.globaldata.getCurrentProjectId();
    this.router.navigate( ['/projects/', this.currentIdProject, 'settings'] );
  }

  exitProject() {
    this.deleteReleasePlan();
    this.globaldata.resetCurrentProjectId();
    this.router.navigate( [''] );
  }

  deleteReleasePlan() {
    this.currentIdRelease = this.globaldata.getCurrentReleaseId();
    if (this.currentIdRelease !== null && this.currentIdRelease !== undefined) {
      this.currentIdProject = this.globaldata.getCurrentProjectId();
      this._replanAPIService.deleteReleasePlan(this.currentIdProject, this.currentIdRelease)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error removing release plan. Try it again later.');
        }
      });
      this.globaldata.resetCurrentReleaseId();
    }
  }

}

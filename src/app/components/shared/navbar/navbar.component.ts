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

  constructor(private globaldata: GlobalDataService,
              private _replanAPIService: replanAPIService,
              private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    this.currentIdProject = this.globaldata.getCurrentProjectId();
    this.router.navigate( ['/projects/', this.currentIdProject] );
  }

  goToProjectSettings() {
    this.currentIdProject = this.globaldata.getCurrentProjectId();
    this.router.navigate( ['/projects/', this.currentIdProject, 'settings'] );
  }

  exitProject() {
    this.globaldata.resetCurrentProjectId();
    this.router.navigate( [''] );
  }

}

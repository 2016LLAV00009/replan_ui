import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html'
})
export class ProjectSettingsComponent implements OnInit {

  idProject: number;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
              });

  }

  ngOnInit() {
    $('.nav-settings').siblings().removeClass('active');
    $('.nav-settings').addClass('active');
  }

}
import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html'
})
export class PlanComponent implements OnInit {

  idProject: number;
  idRelease: number;
  plan: any;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.idRelease = params['id2'];

                  this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
                    .subscribe( data => {
                      this.plan = data;
                    });
              });

  }

  ngOnInit() {
    debugger;
    $('li.nav-item').removeClass('active');
  }

}
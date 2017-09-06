import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare const google: any;

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html'
})
export class PlanComponent implements OnInit {

  idProject: number;
  idRelease: number;
  plan: any;

  chartRows: any[];

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.idRelease = params['id2'];

                  this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
                    .subscribe( data => {
                      debugger; 
                      this.plan = data;
                      this.chartLogic(this.plan);
                    });
              });

  }

  ngOnInit() {
    $('li.nav-item').removeClass('active');
  }

  chartLogic(data) {
    this.chartRows = [];
    data.jobs.forEach(job => {
      const starts = new Date(job.starts);
      const ends = new Date(job.ends);
      const row = [
        job.resource.name,
        job.feature.name,
        new Date(starts.getFullYear(), starts.getMonth(), starts.getDate()),
        new Date(ends.getFullYear(), ends.getMonth(), ends.getDate())
      ];
      this.chartRows.push(row);
    });
    this.drawChart(this.chartRows);
  }

  drawChart(rows) {
    debugger;
    if (rows.length > 0) {
      const container = document.getElementById('timeline');
      const chart = new google.visualization.Timeline(container);
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: 'string', id: 'Resource' });
      dataTable.addColumn({ type: 'string', id: 'Feature' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      dataTable.addRows(rows);
      chart.draw(dataTable);
    }
  }

}
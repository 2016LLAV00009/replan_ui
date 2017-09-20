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
  features: any;
  plan: any;
  featuresNotAssigned: any;
  idFeatureToDelete: any;

  chartRows: any[];

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.idRelease = params['id2'];
                  this.featuresNotAssigned = [];

                  this._replanAPIService.getProject(this.idProject)
                  .subscribe( data => {
                    if (data.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading project data. Try it again later.');
                    }
                    $('.title-project').text(data.name);
                  });
                  $('#loading_for_plan').show();
                  $('#loading_for_dependecies').show();
                  this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
                    .subscribe( data => {
                      if (data.toString() === 'e') {
                        $('#error-modal').modal();
                        $('#loading_for_plan').hide();
                        $('#error-text').text('Error loading release plan data. Try it again later.');
                        this.plan = '';
                        $('.plan-span').text('No planification found');
                      } else {
                        this.plan = data;
                        if (this.plan.jobs.length === 0) {
                          $('.plan-span').text('No planification found');
                        } else {
                          this.chartLogic(this.plan);
                        }
                      }
                      this._replanAPIService.getFeaturesRelease(this.idProject, this.idRelease)
                      .subscribe( data2 => {
                        const self = this;
                        if (data2.toString() === 'e') {
                          $('#error-modal').modal();
                          $('#loading_for_dependecies').hide();
                          $('#error-text').text('Error loading release data. Try it again later.');
                        }
                        data2.forEach(feature => {
                          if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                            self.featuresNotAssigned.push(feature);
                          }
                        });
                        if (this.featuresNotAssigned.length === 0) {
                          $('.not-assigned-span').text('No features not assigned found');
                        }
                        $('#loading_for_dependecies').hide();
                        this.features = data;
                      });
                      $('#loading_for_plan').hide();
                    });
              });

  }

  ngOnInit() { 
    $('li.nav-item').removeClass('active');
  }

  chartLogic(data) {
    if (data.jobs.length > 0) {
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
  }

  drawChart(rows) {
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
      google.visualization.events.addListener(chart, 'select', function(e) {
        const select = chart.getSelection();
        if (select.length > 0) {
          $('.trash-container').show();
          const feature = this.plan.jobs[select[0].row].feature;
          this.idFeatureToDelete = feature.id;
        }
      }.bind(this), false);
      const height = dataTable.getDistinctValues(0).length * 57 + 30;
      $('#timeline').css('height', height + 'px');
    }
  }

  deleteFeature() {
    $('.trash-container').hide();
    $('#timeline').empty();
    $('#loading_for_plan').show();
    $('#loading_for_dependecies').show();
    $('.not-assigned-span').text('');
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.deleteFeatureFromRelease(this.idProject, this.idRelease, this.idFeatureToDelete)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error deleting the feature. Try it again later.');
      }
      this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
      .subscribe( data2 => {
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#loading_for_plan').hide();
          $('#error-text').text('Error loading release plan data. Try it again later.');
          this.plan = '';
          $('.plan-span').text('No planification found');
        } else {
          this.plan = data2;
          if (this.plan.jobs.length === 0) {
            $('.plan-span').text('No planification found');
          } else {
            this.chartLogic(this.plan);
          }
        }
        this._replanAPIService.getFeaturesRelease(this.idProject, this.idRelease)
        .subscribe( data3 => {
          const self = this;
          if (data3.toString() === 'e') {
            $('#error-modal').modal();
            $('#loading_for_dependecies').hide();
            $('#error-text').text('Error loading release data. Try it again later.');
          }
          data3.forEach(feature => {
            if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
              self.featuresNotAssigned.push(feature);
            }
          });
          if (this.featuresNotAssigned.length === 0) {
            $('.not-assigned-span').text('No features not assigned found');
          }
          $('#loading_for_dependecies').hide();
          this.features = data3;
        });
        $('#loading_for_plan').hide();
      });
    });
  }

  refreshPlan() {
    $('.trash-container').hide();
    $('#timeline').empty();
    $('#loading_for_plan').show();
    $('#loading_for_dependecies').show();
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error loading release plan data. Try it again later.');
        $('.plan-span').text('No planification found');
        this.plan = '';
      } else {
        this.plan = data;
        if (this.plan.length === 0) {
          $('.plan-span').text('No planification found');
        } else {
          this.chartLogic(this.plan);
        }
      }
      this._replanAPIService.getFeaturesRelease(this.idProject, this.idRelease)
      .subscribe( data2 => {
        const self = this;
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#loading_for_dependecies').hide();
          $('#error-text').text('Error loading release data. Try it again later.');
        }
        data2.forEach(feature => {
          if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
            self.featuresNotAssigned.push(feature);
          }
        });
        if (this.featuresNotAssigned.length === 0) {
          $('.not-assigned-span').text('No features not assigned found');
        }
        $('#loading_for_dependecies').hide();
        this.features = data;
      });
      $('#loading_for_plan').hide();
    });
  }

}
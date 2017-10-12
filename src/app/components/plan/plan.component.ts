import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { GlobalDataService } from '../../services/globaldata.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;
declare const google: any;

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html'
})
export class PlanComponent implements OnInit {

  idProject: number;
  idRelease: number;
  release: any;
  features: any;
  plan: any;
  featuresNotAssigned: any;
  idFeatureToDelete: any;
  feature: any;
  formEditFeature: FormGroup;
  dependeciesFound: Boolean = false;
  chartRows: any[];
  resourceChartRows: any[];
  dependeciesChartRows: any[];

  constructor(private _replanAPIService: replanAPIService,
              private globaldata: GlobalDataService,
              private activatedRoute: ActivatedRoute) {

              this.formEditFeature = new FormGroup({
                'name': new FormControl(''),
                'description': new FormControl(''),
                'effort': new FormControl(''),
                'deadline': new FormControl(''),
                'priority': new FormControl('')
              });

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.idRelease = params['id2'];
                  this.featuresNotAssigned = [];

                  this.globaldata.setCurrentReleaseId(this.idRelease);
                  this.globaldata.setCurrentProjectId(this.idProject);

                  this._replanAPIService.getRelease(this.idProject, this.idRelease)
                  .subscribe( data => {
                    if (data.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading release data. Try it again later.');
                    }
                    this.release = data;
                    $('.title-project').text(data.name);
                  });
                  $('#loading_for_plan').show();
                  $('#loading_for_features_not_assigned').show();
                  $('#loading_for_resources_chart').show();
                  $('#loading_for_dependecies_chart').show();
                  this.getReleasePlan();
              });

  }

  ngOnInit() {
    $('li.nav-item').removeClass('active');
    $('.btn-previous').prop('disabled' , true);
  }

  chartLogic(data) {
    if (data.jobs.length > 0) {
      this.chartRows = [];
      data.jobs.forEach(job => {
        const row = [
          job.resource.name,
          job.feature.name,
          new Date(job.starts),
          new Date(job.ends)
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

      const options = {
        hAxis: { format: 'dd/MM' }
      };

      const height = dataTable.getDistinctValues(0).length * 51 + 30;
      $('#timeline').css('height', height + 'px');
      $('#timeline div div').first().css('height', height + 'px');
      $('#timeline svg').css('height', height + 'px');

      chart.draw(dataTable, options);

      google.visualization.events.addListener(chart, 'select', function(e) {
        const select = chart.getSelection();
        if (select.length > 0) {
          $('.trash-container').show();
          this.feature = this.plan.jobs[select[0].row].feature;
          this.idFeatureToDelete = this.feature.id;
        }
      }.bind(this), false);
    }
  }

  resourceChartLogic(data) {
    if (data.resource_usage.length > 0) {
      this.resourceChartRows = [];
      this.resourceChartRows.push(['', 'Total available hours', 'Total used hours']);
      data.resource_usage.forEach(resource => {
        const row = [
          resource.resource_name,
          Number(resource.total_available_hours),
          Number(resource.total_used_hours),
        ];
        this.resourceChartRows.push(row);
      });
      this.drawResourcesChart(this.resourceChartRows);
    }
  }

  drawResourcesChart(rows) {
    if (rows.length > 0) {
      const data = google.visualization.arrayToDataTable(rows);

      const options = {
        bars: 'vertical',
        backgroundColor: '#F3FAB6',
        legend: {position: 'none'}
      };

      const chart = new google.charts.Bar(document.getElementById('resources_chart'));
      chart.draw(data, google.charts.Bar.convertOptions(options));

    }
  }

  dependeciesChartLogic(data) {
    if (data.jobs.length > 0) {
      const self = this;
      this.dependeciesChartRows = [];
      const jobsWithDependecies = data.jobs.filter(obj => obj.depends_on.length > 0);
      jobsWithDependecies.forEach(job => {
        let dependecies = '';
        for (let i = 0; i < job.depends_on.length; i++) {
          dependecies += job.depends_on[i].feature_id;
          if (i !== job.depends_on.length - 1) {
            dependecies += ',';
          }
        }
        const row = [
          job.feature.id.toString(),
          job.feature.name,
          new Date(job.starts),
          new Date(job.ends),
          null,
          100,
          dependecies
        ];
        this.dependeciesChartRows.push(row);
        job.depends_on.forEach(dp => {
          const job2 = data.jobs.filter(obj => obj.feature.id === dp.feature_id)[0];
          const row2 = [
            job2.feature.id.toString(),
            job2.feature.name,
            new Date(job2.starts),
            new Date(job2.ends),
            null,
            100,
            null
          ];
          this.dependeciesChartRows.push(row2);
        });
      });
      this.dependeciesChartRows.forEach(dp => {
        if (self.dependeciesChartRows.some(x => x[0] === dp[0] && x !== dp )) {
          const other = self.dependeciesChartRows.filter(x2 => x2[0] === dp[0] && x2 !== dp)[0];
          if (dp[6] !== null) {
            self.dependeciesChartRows = self.dependeciesChartRows.filter(obj => obj !== other);
          } else if (other[6] !== null) {
            self.dependeciesChartRows = self.dependeciesChartRows.filter(obj => obj !== dp);
          } else {
            self.dependeciesChartRows = self.dependeciesChartRows.filter(obj => obj !== other);
          }
        }
      });
      this.drawDependeciesChart(this.dependeciesChartRows);
    }
  }

  drawDependeciesChart(rows) {
    if (rows.length > 0) {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');
      data.addRows(rows);
      const options = {
        backgroundColor: {
          fill: '#F3FAB6'
        }
      };
      const height = data.getDistinctValues(0).length * 53 + 30;
      $('#dependecies_chart').css('height', height + 'px');
      $('#dependecies_chart div div').first().css('height', height + 'px');
      $('#dependecies_chart svg').css('height', height + 'px');
      const chart = new google.visualization.Gantt(document.getElementById('dependecies_chart'));
      chart.draw(data, options);
    }
  }

  deleteFeature() {
    $('.btn-previous').prop('disabled' , true);
    this.setCharts();
    this.setHeight();
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.deleteFeatureFromRelease(this.idProject, this.idRelease, this.idFeatureToDelete)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error removing the feature. Try it again later.');
      }
      this.getReleasePlanNew();
    });
  }

  editFeatureModal() {
    $('#edit-feature-modal').modal();
    this.formEditFeature.controls['name'].setValue(this.feature.name);
    this.formEditFeature.controls['description'].setValue(this.feature.description);
    this.formEditFeature.controls['effort'].setValue(this.feature.effort);
    this.formEditFeature.controls['deadline'].setValue(this.feature.deadline);
    this.formEditFeature.controls['priority'].setValue(this.feature.priority);
  }

  editFeatureAPI() {
    this.formEditFeature.value.name = $('#nameFeatureEdit').val();
    this.formEditFeature.value.description = $('#descriptionFeatureEdit').val();
    this.formEditFeature.value.effort = $('#effortFeatureEdit').val();
    this.formEditFeature.value.deadline = $('#deadlineFeatureEdit').val();
    this.formEditFeature.value.priority = $('#priorityFeatureEdit').val();
    $('.btn-previous').prop('disabled' , true);
    $('#edit-feature-modal').modal('hide');    
    this.setCharts();
    this.setHeight();
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.feature.id)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error editing the feature. Try it again later.');
          }
          this.getReleasePlanNew();
        });
  }

  refreshPlan() {
    $('.btn-previous').prop('disabled' , false);
    this.setCharts();
    this.setHeight();
    this.plan = null;
    this.featuresNotAssigned = [];
    this.getReleasePlanNew();
  }

  previousPlan() {
    $('.btn-previous').prop('disabled' , true);
    this.setCharts();
    this.setHeight();
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.deleteReleasePlan(this.idProject, this.idRelease)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error removing release plan. Try it again later.');
      } else {
        this.getReleasePlan();
      }
    });
  }

  deleteFeatureNotAssigned(id: number) {
    $('.btn-previous').prop('disabled' , true);
    this.setCharts();
    this.setHeight();
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.deleteFeatureFromRelease(this.idProject, this.idRelease, id)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error removing the feature. Try it again later.');
      }
      this.getReleasePlanNew();
    });
  }

  setHeight() {
    $('#timeline').css('height', '0px');
    $('#timeline div div').first().css('height', '0px');
    $('#timeline svg').css('height', '0px');
    $('#dependecies_chart').css('height', '0px');
    $('#dependecies_chart div div').first().css('height', '0px');
    $('#dependecies_chart svg').css('height', '0px');
  }

  setCharts() {
    $('.trash-container').hide();

    $('#timeline').empty();
    $('#resources_chart').empty();
    $('#dependecies_chart').empty();

    $('#loading_for_plan').show();
    $('#loading_for_resources_chart').show();
    $('#loading_for_features_not_assigned').show();
    $('#loading_for_dependecies_chart').show();

    $('.dependecies-chart-span').text('');
    $('.resources-chart-span').text('');
    $('.not-assigned-span').text('');
    $('.plan-span').text('');
  }

  getReleasePlan() {
    this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#loading_for_plan').hide();
        $('#loading_for_resources_chart').hide();
        $('#loading_for_dependecies_chart').hide();
        $('#error-text').text('Error loading release plan data. Try it again later.');
        this.plan = null;
        $('.plan-span').text('No planification found');
        $('.resources-chart-span').text('No resources found');
        $('.not-assigned-span').text('No features not assigned found');
      } else {
        this.plan = data;
        if (this.plan.jobs.length === 0) {
          $('.plan-span').text('No planification found');
        } else {
          this.chartLogic(this.plan);
        }
        if (this.plan.resource_usage.length === 0) {
          $('.resources-chart-span').text('No resources found');
        } else {
          this.resourceChartLogic(this.plan);
        }
        this.dependeciesFound = this.plan.jobs.some(job => job.depends_on.length > 0);
        if (!this.dependeciesFound) {
          $('.dependecies-chart-span').text('No dependecies found');
        } else {
          this.dependeciesChartLogic(this.plan);
        }
      }
      this._replanAPIService.getFeaturesRelease(this.idProject, this.idRelease)
      .subscribe( data2 => {
        const self = this;
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error loading release data. Try it again later.');
        } else {
          if (this.plan !== null) {
            data2.forEach(feature => {
              if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                self.featuresNotAssigned.push(feature);
              }
            });
            if (this.featuresNotAssigned.length === 0) {
              $('.not-assigned-span').text('No features not assigned found');
            }
            this.features = data;
          }
        }
        $('#loading_for_features_not_assigned').hide();
      });
      $('#loading_for_plan').hide();
      $('#loading_for_resources_chart').hide();
      $('#loading_for_dependecies_chart').hide();
    });
  }

  getReleasePlanNew() {
    this._replanAPIService.getReleasePlanNew(this.idProject, this.idRelease)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('.btn-previous').prop('disabled' , false);
        $('#error-modal').modal();
        $('#loading_for_plan').hide();
        $('#loading_for_resources_chart').hide();
        $('#error-text').text('Error loading release plan data. Try it again later.');
        $('.plan-span').text('No planification found');
        $('.resources-chart-span').text('No resources found');
        $('.not-assigned-span').text('No features not assigned found');
        this.plan = null;
      } else {
        this.plan = data;
        if (this.plan.jobs.length === 0) {
          $('.plan-span').text('No planification found');
        } else {
          this.chartLogic(this.plan);
        }
        if (this.plan.resource_usage.length === 0) {
          $('.resources-chart-span').text('No resources found');
        } else {
          this.resourceChartLogic(this.plan);
        }
        this.dependeciesFound = this.plan.jobs.some(job => job.depends_on.length > 0);
        if (!this.dependeciesFound) {
          $('.dependecies-chart-span').text('No dependecies found');
        } else {
          this.dependeciesChartLogic(this.plan);
        }
      }
      this._replanAPIService.getFeaturesRelease(this.idProject, this.idRelease)
      .subscribe( data2 => {
        const self = this;
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error loading release data. Try it again later.');
        } else {
          if (this.plan !== null) {
            data2.forEach(feature => {
              if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                self.featuresNotAssigned.push(feature);
              }
            });
            if (this.featuresNotAssigned.length === 0) {
              $('.not-assigned-span').text('No features not assigned found');
            }
            this.features = data;
          }
        }
        $('#loading_for_features_not_assigned').hide();
      });
      $('#loading_for_plan').hide();
      $('#loading_for_resources_chart').hide();
      $('#loading_for_dependecies_chart').hide();
    });
  }

}
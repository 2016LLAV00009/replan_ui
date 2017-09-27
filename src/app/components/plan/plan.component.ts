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

  chartRows: any[];

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
                  $('#loading_for_dependecies').show();
                  this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
                    .subscribe( data => {
                      if (data.toString() === 'e') {
                        $('#error-modal').modal();
                        $('#loading_for_plan').hide();
                        $('#error-text').text('Error loading release plan data. Try it again later.');
                        this.plan = null;
                        $('.plan-span').text('No planification found');
                        $('.not-assigned-span').text('No features not assigned found');
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
                        $('#loading_for_dependecies').hide();
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
      /*const options = {
        timeline: { colorByRowLabel: true }
      };*/
      chart.draw(dataTable);
      google.visualization.events.addListener(chart, 'select', function(e) {
        const select = chart.getSelection();
        if (select.length > 0) {
          $('.trash-container').show();
          this.feature = this.plan.jobs[select[0].row].feature;
          this.idFeatureToDelete = this.feature.id;
        }
      }.bind(this), false);
      const height = dataTable.getDistinctValues(0).length * 57 + 30;
      $('#timeline').css('height', height + 'px');
      $('#timeline div div').first().css('height', height + 'px');
      $('#timeline svg').css('height', height + 'px');
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
        $('#error-text').text('Error removing the feature. Try it again later.');
      }
      this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
      .subscribe( data2 => {
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#loading_for_plan').hide();
          $('#error-text').text('Error loading release plan data. Try it again later.');
          this.plan = null;
          $('.plan-span').text('No planification found');
          $('.not-assigned-span').text('No features not assigned found');
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
            $('#error-text').text('Error loading release data. Try it again later.');
          } else {
            if (this.plan !== null) {
              data3.forEach(feature => {
                if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                  self.featuresNotAssigned.push(feature);
                }
              });
              if (this.featuresNotAssigned.length === 0) {
                $('.not-assigned-span').text('No features not assigned found');
              }
              this.features = data3;
            }
          }
          $('#loading_for_dependecies').hide();
        });
        $('#loading_for_plan').hide();
      });
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
    $('#edit-feature-modal').modal('hide');
    $('.trash-container').hide();
    $('#timeline').empty();
    $('#loading_for_plan').show();
    $('#loading_for_dependecies').show();
    $('.not-assigned-span').text('');
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.feature.id)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error editing the feature. Try it again later.');
          }
          this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#loading_for_plan').hide();
              $('#error-text').text('Error loading release plan data. Try it again later.');
              this.plan = null;
              $('.plan-span').text('No planification found');
              $('.not-assigned-span').text('No features not assigned found');
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
                $('#error-text').text('Error loading release data. Try it again later.');
              } else {
                if (this.plan !== null) {
                  data3.forEach(feature => {
                    if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                      self.featuresNotAssigned.push(feature);
                    }
                  });
                  if (this.featuresNotAssigned.length === 0) {
                    $('.not-assigned-span').text('No features not assigned found');
                  }
                  this.features = data3;
                }
              }
              $('#loading_for_dependecies').hide();
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
    $('.not-assigned-span').text('');
    $('.plan-span').text('');
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error loading release plan data. Try it again later.');
        $('.plan-span').text('No planification found');
        $('.not-assigned-span').text('No features not assigned found');
        this.plan = null;
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
        $('#loading_for_dependecies').hide();
      });
      $('#loading_for_plan').hide();
    });
  }

  deleteFeatureNotAssigned(id: number) {
    $('.trash-container').hide();
    $('#timeline').empty();
    $('#loading_for_plan').show();
    $('#loading_for_dependecies').show();
    $('.not-assigned-span').text('');
    this.plan = null;
    this.featuresNotAssigned = [];
    this._replanAPIService.deleteFeatureFromRelease(this.idProject, this.idRelease, id)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error removing the feature. Try it again later.');
      }
      this._replanAPIService.getReleasePlan(this.idProject, this.idRelease)
      .subscribe( data2 => {
        if (data2.toString() === 'e') {
          $('#error-modal').modal();
          $('#loading_for_plan').hide();
          $('#error-text').text('Error loading release plan data. Try it again later.');
          this.plan = null;
          $('.plan-span').text('No planification found');
          $('.not-assigned-span').text('No features not assigned found');
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
            $('#error-text').text('Error loading release data. Try it again later.');
          } else {
            if (this.plan !== null) {
              data3.forEach(feature => {
                if (!self.plan.jobs.some(x => x.feature.id === feature.id )) {
                  self.featuresNotAssigned.push(feature);
                }
              });
              if (this.featuresNotAssigned.length === 0) {
                $('.not-assigned-span').text('No features not assigned found');
              }
              this.features = data3;
            }
          }
          $('#loading_for_dependecies').hide();
        });
        $('#loading_for_plan').hide();
      });
    });
  }

}
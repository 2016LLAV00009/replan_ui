import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { GlobalDataService } from '../../services/globaldata.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from '../../app.constants';
import { CustomValidators } from 'ng2-validation';
import {DndModule} from 'ng2-dnd';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {

  releases: any;
  features: any;
  idProject: number;
  formFeature: FormGroup;
  formRelease: FormGroup;
  formEditFeature: FormGroup;
  formEditRelease: FormGroup;
  isEditFeatureButtonClicked: boolean;
  isDeleteFeatureButtonClicked: boolean;
  isEditReleaseButtonClicked: boolean;
  isDeleteReleaseButtonClicked: boolean;

  skills: any;
  skillsNotAssigned: any;
  skillsToAssign: any;
  skillsModified: any;
  dependencies: any;
  dependenciesNotAssigned: any;
  dependenciesToAssign: any;
  dependenciesModified: any;
  featureToEdit: any;

  resources: any;
  resourcesNotAssigned: any;
  resourcesToAssign: any;
  releaseToEdit: any;
  resourcesModified: any;

  innerHeight: any;
  innerWidth: any;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private globaldata: GlobalDataService) {
                this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.globaldata.setCurrentProjectId(this.idProject);
                  this._replanAPIService.getProject(this.idProject)
                  .subscribe( data => {
                    if (data.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading project data. Try it again later.');
                    }
                    $('.title-project').text(data.name);
                  });
                  this._replanAPIService.getSkillsProject(this.idProject)
                  .subscribe( data => {
                    if (data.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading project skills data. Try it again later.');
                    }
                    this.skills = data;
                  });
                  this._replanAPIService.getResourcesProject(this.idProject)
                  .subscribe( data => {
                    if (data.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading project resources data. Try it again later.');
                    }
                    this.resources = data;
                  });
                });

                this.formFeature = new FormGroup({
                  'code': new FormControl(''),
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'effort': new FormControl(''),
                  'deadline': new FormControl(''),
                  'priority': new FormControl('')
                });

                this.formEditFeature = new FormGroup({
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'effort': new FormControl(''),
                  'deadline': new FormControl(''),
                  'priority': new FormControl('')
                });

                this.formRelease = new FormGroup({
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'starts_at': new FormControl(''),
                  'deadline': new FormControl('')
                });

                this.formEditRelease = new FormGroup({
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'starts_at': new FormControl(''),
                  'deadline': new FormControl('')
                });

  }

  ngOnInit() {
    const self = this;
    $('.nav-home').siblings().removeClass('active');
    $('.nav-home').addClass('active');
    $('#loading_for_features').show();
    $('#loading_for_releases').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('#addReleaseDiv').addClass('margin_to_loading');
    this._replanAPIService.getFeaturesProject(this.idProject)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error loading features data. Try it again later.');
        }
        $('#loading_for_features').hide();
        $('#addFeatureDiv').removeClass('margin_to_loading');
        this.dependencies = data;
        this.features = data.filter(f => f.release === 'pending');
        if (this.features.length === 0) {
          $('.features-span').text('No features found');
        }
      });
    this._replanAPIService.getReleasesProject(this.idProject)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error loading releases data. Try it again later.');
        }
        $('#loading_for_releases').hide();
        $('#addReleaseDiv').removeClass('margin_to_loading');
        this.releases = data;
        if (this.releases.length === 0) {
          $('.releases-span').text('No releases found');
        }
      });
    this.isDeleteFeatureButtonClicked = false;
    this.isDeleteReleaseButtonClicked = false;
    this.isEditFeatureButtonClicked = false;
    this.isEditReleaseButtonClicked = false;
    $('#add-feature-modal').on('hidden.bs.modal', function (e) {
      self.clearAddFeatureModal();
    });
    $('#add-release-modal').on('hidden.bs.modal', function (e) {
      self.clearAddReleaseModal();
    });
  }

  getLowFeatureEffort() {
    return AppConstants.LOW_FEATURE_EFFORT;
  }

  getHighFeatureEffort() {
    return AppConstants.HIGH_FEATURE_EFFORT;
  }

  addFeatureModal() {
    const date = new Date();
    const code = Number(date.getDate().toString() + date.getHours().toString() +
                 date.getSeconds().toString() + date.getMilliseconds().toString());
    this.formFeature.controls['code'].setValue(code);
    const self = this;
    this.skillsModified = false;
    this.dependenciesModified = false;
    this.skillsNotAssigned = [];
    this.skillsToAssign = [];
    this.dependenciesNotAssigned = [];
    this.dependenciesToAssign = [];
    this.skills.forEach(skill => {
      self.skillsNotAssigned.push(skill);
    });
    this.dependencies.forEach(feature => {
      self.dependenciesNotAssigned.push(feature);
    });
    $('#add-feature-modal').modal();
  }

  addReleaseModal() {
    this.resourcesModified = false;
    const self = this;
    this.resourcesNotAssigned = [];
    this.resourcesToAssign = [];
    this.resources.forEach(resource => {
      self.resourcesNotAssigned.push(resource);
    });
    $('#add-release-modal').modal();
  }

  addNewFeature() {
    $('#add-feature-modal').modal('hide');
    $('.features-span').text('');
    $('#loading_for_features').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('.features-container').hide();
    this._replanAPIService.addFeatureToProject(JSON.stringify(this.formFeature.value), this.idProject)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error creating the feature. Try it again later.');
          }
          if (this.skillsModified || this.dependenciesModified) {
            const idFeature = data.id;
            const objArray = [];
            this.skillsToAssign.forEach(skill => {
              const obj = {
                skill_id: skill.id
              };
              objArray.push(obj);
            });
            this._replanAPIService.addSkillsToFeature(JSON.stringify(objArray), this.idProject, idFeature)
            .subscribe( data2 => {
                if (data2.toString() === 'e') {
                  $('#error-modal').modal();
                  $('#error-text').text('Error creating the feature. Try it again later.');
                }
                const objArray2 = [];
                this.dependenciesToAssign.forEach(feature => {
                  const obj = {
                    feature_id: feature.id
                  };
                  objArray2.push(obj);
                });
                this._replanAPIService.addDependenciesToFeature(JSON.stringify(objArray2), this.idProject, idFeature)
                .subscribe( data3 => {
                  if (data3.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error creating the feature. Try it again later.');
                  }
                  this._replanAPIService.getFeaturesProject(this.idProject)
                  .subscribe( data4 => {
                    if (data4.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading features data. Try it again later.');
                    }
                    this.dependencies = data4;
                    this.features = data4.filter(f => f.release === 'pending');
                    if (this.features.length === 0) {
                      $('.features-span').text('No features found');
                    }
                    $('#loading_for_features').hide();
                    $('#addFeatureDiv').removeClass('margin_to_loading');
                    $('.features-container').show();
                  });
                  });
              });
          } else {
            this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading features data. Try it again later.');
              }
              this.dependencies = data2;
              this.features = data2.filter(f => f.release === 'pending');
              if (this.features.length === 0) {
                $('.features-span').text('No features found');
              }
              $('#loading_for_features').hide();
              $('#addFeatureDiv').removeClass('margin_to_loading');
              $('.features-container').show();
            });
          }
        });
  }

  editFeature(idFeature: number) {
    this.isEditFeatureButtonClicked = true;
    this.skillsModified = false;
    this.dependenciesModified = false;
    const self = this;
    this.skillsNotAssigned = [];
    this.skillsToAssign = [];
    this.dependenciesNotAssigned = [];
    this.dependenciesToAssign = [];
    this.featureToEdit = this.features.filter(f => f.id === idFeature)[0];
    this.featureToEdit.required_skills.forEach(skill => {
      this.skillsToAssign.push(skill);
    });
    this.featureToEdit.depends_on.forEach(feature => {
      this.dependenciesToAssign.push(feature);
    });
    this.skills.forEach(skill => {
      if (!self.skillsToAssign.some(x => x.id === skill.id )) {
        self.skillsNotAssigned.push(skill);
      }
    });
    this.dependencies.forEach(feature => {
      if (!self.dependenciesToAssign.some(x => x.id === feature.id ) && feature.id !== self.featureToEdit.id) {
        self.dependenciesNotAssigned.push(feature);
      }
    });
    $('#edit-feature-modal').modal();
    this.formEditFeature.controls['name'].setValue(this.featureToEdit.name);
    this.formEditFeature.controls['description'].setValue(this.featureToEdit.description);
    this.formEditFeature.controls['effort'].setValue(this.featureToEdit.effort);
    this.formEditFeature.controls['deadline'].setValue(this.featureToEdit.deadline);
    this.formEditFeature.controls['priority'].setValue(this.featureToEdit.priority);
  }

  editFeatureAPI() {
    this.formEditFeature.value.name = $('#nameFeatureEdit').val();
    this.formEditFeature.value.description = $('#descriptionFeatureEdit').val();
    this.formEditFeature.value.effort = $('#effortFeatureEdit').val();
    this.formEditFeature.value.deadline = $('#deadlineFeatureEdit').val();
    this.formEditFeature.value.priority = $('#priorityFeatureEdit').val();
    $('#edit-feature-modal').modal('hide');
    $('#loading_for_features').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('.features-container').hide();
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.featureToEdit.id)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error editing the feature. Try it again later.');
          }
          if (this.skillsModified || this.dependenciesModified) {
            this._replanAPIService.deleteSkillsFromFeature(this.idProject, this.featureToEdit.id, this.featureToEdit.required_skills)
              .subscribe( data2 => {
                if (data2.toString() === 'e') {
                  $('#error-modal').modal();
                  $('#error-text').text('Error editing the feature. Try it again later.');
                }
                const objArray = [];
                this.skillsToAssign.forEach(skill => {
                  const obj = {
                    skill_id: skill.id
                  };
                  objArray.push(obj);
                });
                this._replanAPIService.addSkillsToFeature(JSON.stringify(objArray), this.idProject, this.featureToEdit.id)
                .subscribe( data3 => {
                  if (data3.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error editing the feature. Try it again later.');
                  }
                  this._replanAPIService.deleteDependenciesFromFeature(this.idProject, this.featureToEdit.id, this.featureToEdit.depends_on)
                  .subscribe( data4 => {
                    if (data4.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error editing the feature. Try it again later.');
                    }
                    const objArray2 = [];
                    this.dependenciesToAssign.forEach(feature => {
                      const obj = {
                        feature_id: feature.id
                      };
                      objArray2.push(obj);
                    });
                    this._replanAPIService.addDependenciesToFeature(JSON.stringify(objArray2), this.idProject, this.featureToEdit.id)
                    .subscribe( data5 => {
                      if (data5.toString() === 'e') {
                        $('#error-modal').modal();
                        $('#error-text').text('Error editing the features. Try it again later.');
                      }
                      this._replanAPIService.getFeaturesProject(this.idProject)
                      .subscribe( data6 => {
                        if (data6.toString() === 'e') {
                          $('#error-modal').modal();
                          $('#error-text').text('Error loading features data. Try it again later.');
                        }
                        this.dependencies = data6;
                        this.features = data6.filter(f => f.release === 'pending');
                        if (this.features.length === 0) {
                          $('.features-span').text('No features found');
                        }
                        $('#loading_for_features').hide();
                        $('#addFeatureDiv').removeClass('margin_to_loading');
                        $('.features-container').show();
                      });
                     });
                  });
                });
              });
          } else {
            this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading features data. Try it again later.');
              }
              this.dependencies = data2;
              this.features = data2.filter(f => f.release === 'pending');
              if (this.features.length === 0) {
                $('.features-span').text('No features found');
              }
              $('#loading_for_features').hide();
              $('#addFeatureDiv').removeClass('margin_to_loading');
              $('.features-container').show();
            });
          }
        });
  }

  transferSkill($event: any) {
    this.skillsModified = true;
    this.skillsNotAssigned = this.skillsNotAssigned.filter(obj => obj !== $event.dragData);
    this.skillsToAssign.push($event.dragData);
  }

  removeSkill($event: any) {
    this.skillsModified = true;
    this.skillsToAssign = this.skillsToAssign.filter(obj => obj !== $event.dragData);
    this.skillsNotAssigned.push($event.dragData);
  }

  allowDropFunction(skills: any, depNot: any, depTo: any) {
    return (dragData: any) => (!skills.some(skill => skill === dragData)
                              && !depNot.some(dep => dep === dragData)
                              && !depTo.some(dep2 => dep2 === dragData));
  }

  transferDependencie($event: any) {
    this.dependenciesModified = true;
    this.dependenciesNotAssigned = this.dependenciesNotAssigned.filter(obj => obj !== $event.dragData);
    this.dependenciesToAssign.push($event.dragData);
  }

  removeDependencie($event: any) {
    this.dependenciesModified = true;
    this.dependenciesToAssign = this.dependenciesToAssign.filter(obj => obj !== $event.dragData);
    this.dependenciesNotAssigned.push($event.dragData);
  }

  allowDropFunctionDependencies(dependencies: any, skillsNot: any, skillsTo: any) {
    return (dragData: any) => (!dependencies.some(dependencie => dependencie === dragData)
                              && !skillsNot.some(skills => skills === dragData)
                              && !skillsTo.some(skills2 => skills2 === dragData));
  }

  deleteFeature(idFeature: number) {
    $('#loading_for_features').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('.features-container').hide();
    this._replanAPIService.deleteFeature(this.idProject, idFeature)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error deleting the feature. Try it again later.');
        }
        this._replanAPIService.getFeaturesProject(this.idProject)
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error loading features data. Try it again later.');
            }
            $('#loading_for_features').hide();
            $('#addFeatureDiv').removeClass('margin_to_loading');
            $('.features-container').show();
            this.dependencies = data2;
            this.features = data2.filter(f => f.release === 'pending');
            if (this.features.length === 0) {
              $('.features-span').text('No features found');
            }
          });
      });
  }

  addNewRelease() {
    if (new Date(this.formRelease.controls['starts_at'].value) > new Date(this.formRelease.controls['deadline'].value)) {
      $('#add-release-modal').modal('hide');
      $('#error-modal').modal();
      $('#error-text').text('Deadline date is before the start date.');
    } else {
      $('#add-release-modal').modal('hide');
      $('.releases-span').text('');
      $('#loading_for_releases').show();
      $('#addReleaseDiv').addClass('margin_to_loading');
      $('.releases-container').hide();
      this._replanAPIService.addReleaseToProject(JSON.stringify(this.formRelease.value), this.idProject)
          .subscribe( data => {
            if (data.toString() === 'e') {
              $('#error-modal').modal();
              $('#loading_for_releases').hide();
              $('#error-text').text('Error creating the release. Try it again later.');
            }
            if (this.resourcesModified) {
                const objArray = [];
                this.resourcesToAssign.forEach(resource => {
                  const obj = {
                    resource_id: resource.id
                  };
                  objArray.push(obj);
                });
                this._replanAPIService.addResourcesToRelease(JSON.stringify(objArray), this.idProject, data.id)
                .subscribe( data2 => {
                  if (data2.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#loading_for_releases').hide();
                    $('#error-text').text('Error creating the release. Try it again later.');
                  }
                  this._replanAPIService.getReleasesProject(this.idProject)
                    .subscribe( data3 => {
                      if (data3.toString() === 'e') {
                        $('#error-modal').modal();
                        $('#loading_for_releases').hide();
                        $('#error-text').text('Error loading releases data. Try it again later.');
                      }
                      this.releases = data3;
                      if (this.releases.length === 0) {
                        $('.releases-span').text('No releases found');
                      }
                      $('#loading_for_releases').hide();
                      $('#addReleaseDiv').removeClass('margin_to_loading');
                      $('.releases-container').show();
                    });
                });
            } else {
              this._replanAPIService.getReleasesProject(this.idProject)
                .subscribe( data2 => {
                  if (data2.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error loading releases data. Try it again later.');
                  }
                  this.releases = data2;
                  if (this.releases.length === 0) {
                    $('.releases-span').text('No releases found');
                  }
                  $('#loading_for_releases').hide();
                  $('#addReleaseDiv').removeClass('margin_to_loading');
                  $('.releases-container').show();
                });
            }
          });
    }
  }

  editRelease(idRelease: number) {
    this.isEditReleaseButtonClicked = true;
    this.resourcesModified = false;
    const self = this;
    this.resourcesNotAssigned = [];
    this.resourcesToAssign = [];
    this.releaseToEdit = this.releases.filter(f => f.id === idRelease)[0];
    this.releaseToEdit.resources.forEach(resource => {
      this.resourcesToAssign.push(resource);
    });
    this.resources.forEach(resource => {
      if (!self.resourcesToAssign.some(x => x.id === resource.id )) {
        self.resourcesNotAssigned.push(resource);
      }
    });
    $('#edit-release-modal').modal();
    this.formEditRelease.controls['name'].setValue(this.releaseToEdit.name);
    this.formEditRelease.controls['description'].setValue(this.releaseToEdit.description);
    if (this.releaseToEdit.starts_at) {
      this.releaseToEdit.starts_at = this.releaseToEdit.starts_at.substring(0, 10);
    }
    this.formEditRelease.controls['starts_at'].setValue(this.releaseToEdit.starts_at);
    if (this.releaseToEdit.deadline) {
      this.releaseToEdit.deadline = this.releaseToEdit.deadline.substring(0, 10);
    }
    this.formEditRelease.controls['deadline'].setValue(this.releaseToEdit.deadline);
  }

  editReleaseAPI() {
    this.formEditRelease.value.name = $('#nameReleaseEdit').val();
    this.formEditRelease.value.description = $('#descriptionReleaseEdit').val();
    this.formEditRelease.value.starts_at = $('#starts_atReleaseEdit').val();
    this.formEditRelease.value.deadline = $('#deadlineReleaseEdit').val();
    if (new Date(this.formEditRelease.controls['starts_at'].value) > new Date(this.formEditRelease.controls['deadline'].value)) {
      $('#edit-release-modal').modal('hide');
      $('#error-modal').modal();
      $('#error-text').text('Deadline date is before the start date.');
    } else {
      $('#edit-release-modal').modal('hide');
      $('#loading_for_releases').show();
      $('#addReleaseDiv').addClass('margin_to_loading');
      $('.releases-container').hide();
      this._replanAPIService.editRelease(JSON.stringify(this.formEditRelease.value), this.idProject, this.releaseToEdit.id)
          .subscribe( data => {
            if (data.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error editing the release. Try it again later.');
            }
            if (this.resourcesModified) {
              this._replanAPIService.deleteResourcesFromRelease(this.idProject, this.releaseToEdit.id, this.releaseToEdit.resources)
              .subscribe( data2 => {
                if (data2.toString() === 'e') {
                  $('#error-modal').modal();
                  $('#error-text').text('Error editing the release. Try it again later.');
                }
                const objArray = [];
                this.resourcesToAssign.forEach(resource => {
                  const obj = {
                    resource_id: resource.id
                  };
                  objArray.push(obj);
                });
                this._replanAPIService.addResourcesToRelease(JSON.stringify(objArray), this.idProject, this.releaseToEdit.id)
                .subscribe( data3 => {
                  if (data3.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error editing the release. Try it again later.');
                  }
                  this._replanAPIService.getReleasesProject(this.idProject)
                    .subscribe( data4 => {
                      if (data4.toString() === 'e') {
                        $('#error-modal').modal();
                        $('#error-text').text('Error loading releases data. Try it again later.');
                      }
                      this.releases = data4;
                      if (this.releases.length === 0) {
                        $('.releases-span').text('No releases found');
                      }
                      $('#loading_for_releases').hide();
                      $('#addReleaseDiv').removeClass('margin_to_loading');
                      $('.releases-container').show();
                    });
                });
              });
            } else {
              this._replanAPIService.getReleasesProject(this.idProject)
                .subscribe( data2 => {
                  if (data2.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error loading releases data. Try it again later.');
                  }
                  this.releases = data2;
                  if (this.releases.length === 0) {
                    $('.releases-span').text('No releases found');
                  }
                  $('#loading_for_releases').hide();
                  $('#addReleaseDiv').removeClass('margin_to_loading');
                  $('.releases-container').show();
                });
            }
          });
    }
  }

  transferResource($event: any) {
    this.resourcesModified = true;
    this.resourcesNotAssigned = this.resourcesNotAssigned.filter(obj => obj !== $event.dragData);
    this.resourcesToAssign.push($event.dragData);
  }

  removeResource($event: any) {
    this.resourcesModified = true;
    this.resourcesToAssign = this.resourcesToAssign.filter(obj => obj !== $event.dragData);
    this.resourcesNotAssigned.push($event.dragData);
  }

  allowDropFunctionResources(resources: any) {
    return (dragData: any) => !resources.some(resource => resource === dragData);
  }

  deleteRelease(idRelease: number) {
    this.isDeleteReleaseButtonClicked = true;
    $('#loading_for_releases').show();
    $('#addReleaseDiv').addClass('margin_to_loading');
    $('.releases-container').hide();
    $('#loading_for_features').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('.features-container').hide();
    this._replanAPIService.deleteRelease(this.idProject, idRelease)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error deleting the release. Try it again later.');
        }
        this._replanAPIService.getReleasesProject(this.idProject)
        .subscribe( data2 => {
          if (data2.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error loading releases data. Try it again later.');
          }
          $('#loading_for_releases').hide();
          $('#addReleaseDiv').removeClass('margin_to_loading');
          $('.releases-container').show();
          this.releases = data2;
          if (this.releases.length === 0) {
            $('.releases-span').text('No releases found');
          }
        });
        this._replanAPIService.getFeaturesProject(this.idProject)
        .subscribe( data3 => {
          if (data3.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error loading features data. Try it again later.');
          }
          $('#loading_for_features').hide();
          $('#addFeatureDiv').removeClass('margin_to_loading');
          $('.features-container').show();
          this.features = data3.filter(f => f.release === 'pending');
          if (this.features.length === 0) {
            $('.features-span').text('No features found');
          } else {
            $('.features-span').text('');
          }
        });
      });
  }

  transferDataSuccess($event: any, idRelease: number) {
      this.addFeatureToRelease($event.dragData, idRelease);
  }

  addFeatureToRelease(idFeature: number, idRelease: number) {
    $('#loading_for_features').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('.features-container').hide();
    const body = '[{"feature_id":' + idFeature + '}]';
     this._replanAPIService.addFeatureToRelease(this.idProject, idRelease, body)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error adding feature to release. Try it again later.');
          }
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading features data. Try it again later.');
              }
              $('#loading_for_features').hide();
              $('#addFeatureDiv').removeClass('margin_to_loading');
              $('.features-container').show();
              this.features = data2.filter(f => f.release === 'pending');
              if (this.features.length === 0) {
                $('.features-span').text('No features found');
              } else {
                $('.features-span').text('');
              }
            });
        });
  }

  goToPlan(idRelease: number) {
    if (!this.isEditReleaseButtonClicked && !this.isDeleteReleaseButtonClicked) {
      this.router.navigate( ['/projects', this.idProject, 'releases', idRelease, 'plan'] );
    }
    this.isEditReleaseButtonClicked = false;
    this.isDeleteReleaseButtonClicked = false;
  }

  clearAddFeatureModal() {
    $('#code').val('');
    $('#nameFeature').val('');
    $('#effort').val('');
    $('#priority').val('');
    $('#descriptionFeature').val('');
    $('#deadlineFeature').val('');
  }

  clearAddReleaseModal() {
    $('#nameRelease').val('');
    $('#starts_atRelease').val('');
    $('#deadlineRelease').val('');
    $('#descriptionRelease').val('');
  }

}

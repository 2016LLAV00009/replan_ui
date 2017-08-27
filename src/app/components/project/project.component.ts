import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { GlobalDataService } from '../../services/globaldata.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  featureToEdit: any;

  resources: any;
  resourcesNotAssigned: any;
  resourcesToAssign: any;
  releaseToEdit: any;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private globaldata: GlobalDataService) {

                this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.globaldata.setCurrentProjectId(this.idProject);
                  this._replanAPIService.getProject(this.idProject)
                  .subscribe( data => {
                    $('.navbar-center').text(data.name);
                  });
                  this._replanAPIService.getSkillsProject(this.idProject)
                  .subscribe( data => {
                    this.skills = data;
                  });
                  this._replanAPIService.getResourcesProject(this.idProject)
                  .subscribe( data => {
                    this.resources = data;
                  });
                });

                this.formFeature = new FormGroup({
                  'code': new FormControl('', Validators.required),
                  'name': new FormControl('', Validators.required),
                  'description': new FormControl(''),
                  'effort': new FormControl('', Validators.required),
                  'deadline': new FormControl('', Validators.required),
                  'priority': new FormControl('', Validators.required)
                });

                this.formEditFeature = new FormGroup({
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'effort': new FormControl(''),
                  'deadline': new FormControl(''),
                  'priority': new FormControl('')
                });

                this.formRelease = new FormGroup({
                  'name': new FormControl('', Validators.required),
                  'description': new FormControl('', Validators.required),
                  'starts_at': new FormControl('', Validators.required),
                  'deadline': new FormControl('', Validators.required)
                });

                this.formEditRelease = new FormGroup({
                  'name': new FormControl(''),
                  'description': new FormControl(''),
                  'starts_at': new FormControl(''),
                  'deadline': new FormControl('')
                });

  }

  ngOnInit() {
    $('.nav-home').siblings().removeClass('active');
    $('.nav-home').addClass('active');
    $('#loading_for_features').show();
    $('#loading_for_releases').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('#addReleaseDiv').addClass('margin_to_loading');
    this._replanAPIService.getFeaturesProject(this.idProject)
      .subscribe( data => {
        $('#loading_for_features').hide();
        $('#addFeatureDiv').removeClass('margin_to_loading');
        this.features = data.filter(f => f.release === 'pending');
        if (this.features.length === 0) {
          $('.features-span').text('No features found');
        }
      });
    this._replanAPIService.getReleasesProject(this.idProject)
      .subscribe( data => {
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
  }

  addFeatureModal() {
    $('#add-feature-modal').modal();
  }

  addReleaseModal() {
    $('#add-release-modal').modal();
  }

  addNewFeature() {
    $('#add-feature-modal').modal('hide');
    this._replanAPIService.addFeatureToProject(JSON.stringify(this.formFeature.value), this.idProject)
        .subscribe( data => {
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              this.features = data2.filter(f => f.release === 'pending');
            });
            if (this.features.length === 0) {
              $('.features-span').text('No features found');
            }
        });
  }

  editFeature(idFeature: number) {
    this.isEditFeatureButtonClicked = true;
    const self = this;
    this.skillsNotAssigned = [];
    this.skillsToAssign = [];
    this.featureToEdit = this.features.filter(f => f.id === idFeature)[0];
    this.featureToEdit.required_skills.forEach(skill => {
      this.skillsToAssign.push(skill);
    });
    this.skills.forEach(skill => {
      if (!self.skillsToAssign.some(x => x.id === skill.id )) {
        self.skillsNotAssigned.push(skill);
      }
    });
    $('#edit-feature-modal').modal();
    $('#nameFeatureEdit').val(this.featureToEdit.name);
    $('#descriptionFeatureEdit').val(this.featureToEdit.description);
    $('#effortFeatureEdit').val(this.featureToEdit.effort);
    $('#deadlineFeatureEdit').val(this.featureToEdit.deadline);
    $('#priorityFeatureEdit').val(this.featureToEdit.priority);
  }

  editFeatureAPI() {
    this.formEditFeature.value.name = $('#nameFeatureEdit').val();
    this.formEditFeature.value.description = $('#descriptionFeatureEdit').val();
    this.formEditFeature.value.effort = $('#effortFeatureEdit').val();
    this.formEditFeature.value.deadline = $('#deadlineFeatureEdit').val();
    this.formEditFeature.value.priority = $('#priorityFeatureEdit').val();
    let objArray = [];
    this.skillsToAssign.forEach(skill => {
      let obj = {
        id: skill.id
      };
      objArray.push(obj);
    });
    $('#edit-feature-modal').modal('hide');
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.featureToEdit.id)
        .subscribe( data => {
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              this.features = data2.filter(f => f.release === 'pending');
              if (this.features.length === 0) {
                $('.features-span').text('No features found');
              }
            });
        });
  }

  transferSkill($event: any) {
    this.skillsNotAssigned = this.skillsNotAssigned.filter(obj => obj !== $event.dragData);
    this.skillsToAssign.push($event.dragData);
  }

  removeSkill($event: any) {
    this.skillsToAssign = this.skillsToAssign.filter(obj => obj !== $event.dragData);
    this.skillsNotAssigned.push($event.dragData);
  }

  allowDropFunction(skills: any) {
    return (dragData: any) => !skills.some(skill => skill === dragData);
  }

  deleteFeature(idFeature: number) {
    this._replanAPIService.deleteFeature(this.idProject, idFeature)
      .subscribe( data => {
        this._replanAPIService.getFeaturesProject(this.idProject)
          .subscribe( data2 => {
            this.features = data2.filter(f => f.release === 'pending');
            if (this.features.length === 0) {
              $('.features-span').text('No features found');
            }
          });
      });
  }

  addNewRelease() {
    $('#add-release-modal').modal('hide');
    this._replanAPIService.addReleaseToProject(JSON.stringify(this.formRelease.value), this.idProject)
        .subscribe( data => {
          this._replanAPIService.getReleasesProject(this.idProject)
            .subscribe( data2 => {
              this.releases = data2;
              if (this.releases.length === 0) {
                $('.releases-span').text('No releases found');
              } else {
                $('.releases-span').text('');
              }
            });
        });
  }

  editRelease(idRelease: number) {
    this.isEditReleaseButtonClicked = true;
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
    $('#nameReleaseEdit').val(this.releaseToEdit.name);
    $('#descriptionReleaseEdit').val(this.releaseToEdit.description);
    if (this.releaseToEdit.starts_at) {
      this.releaseToEdit.starts_at = this.releaseToEdit.starts_at.substring(0, 10);
    }
    $('#starts_atReleaseEdit').val(this.releaseToEdit.starts_at);
    if (this.releaseToEdit.deadline) {
      this.releaseToEdit.deadline = this.releaseToEdit.deadline.substring(0, 10);
    }
    $('#deadlineReleaseEdit').val(this.releaseToEdit.deadline);
  }

  editReleaseAPI() {
    this.formEditRelease.value.name = $('#nameReleaseEdit').val();
    this.formEditRelease.value.description = $('#descriptionReleaseEdit').val();
    this.formEditRelease.value.starts_at = $('#starts_atReleaseEdit').val();
    this.formEditRelease.value.deadline = $('#deadlineReleaseEdit').val();
    $('#edit-release-modal').modal('hide');
    let objArray = [];
    this.resourcesToAssign.forEach(resource => {
      let obj = {
        id: resource.id
      };
      objArray.push(obj);
    });
    this._replanAPIService.editRelease(JSON.stringify(this.formEditRelease.value), this.idProject, this.releaseToEdit.id)
        .subscribe( data => {
          this._replanAPIService.getReleasesProject(this.idProject)
            .subscribe( data2 => {
              this.releases = data2;
              if (this.releases.length === 0) {
                $('.releases-span').text('No releases found');
              }
            });
        });
  }

  transferResource($event: any) {
    this.resourcesNotAssigned = this.resourcesNotAssigned.filter(obj => obj !== $event.dragData);
    this.resourcesToAssign.push($event.dragData);
  }

  removeResource($event: any) {
    this.resourcesToAssign = this.resourcesToAssign.filter(obj => obj !== $event.dragData);
    this.resourcesNotAssigned.push($event.dragData);
  }

  allowDropFunctionResources(resources: any) {
    return (dragData: any) => !resources.some(resource => resource === dragData);
  }

  deleteRelease(idRelease: number) {
    this._replanAPIService.deleteRelease(this.idProject, idRelease)
      .subscribe( data => {
        this._replanAPIService.getReleasesProject(this.idProject)
          .subscribe( data2 => {
            this.releases = data2;
            if (this.releases.length === 0) {
              $('.releases-span').text('No releases found');
            }
          });
      });
  }

  transferDataSuccess($event: any, idRelease: number) {
      this.addFeatureToRelease($event.dragData, idRelease);
  }

  addFeatureToRelease(idFeature: number, idRelease: number) {
    const body = '[{"feature_id":' + idFeature + '}]';
     this._replanAPIService.addFeatureToRelease(this.idProject, idRelease, body)
        .subscribe( data => {
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
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
      this.router.navigate( ['/project', this.idProject, 'release', idRelease, 'plan'] );
    }
    this.isEditReleaseButtonClicked = false;
    this.isDeleteReleaseButtonClicked = false;
  }

}

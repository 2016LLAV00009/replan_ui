import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
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

  releases: string[] = [];
  features: string[] = [];
  idProject: number;
  formFeature: FormGroup;
  formRelease: FormGroup;
  formEditFeature: FormGroup;
  formEditRelease: FormGroup;
  isEditFeatureButtonClicked: boolean;
  isDeleteFeatureButtonClicked: boolean;
  isEditReleaseButtonClicked: boolean;
  isDeleteReleaseButtonClicked: boolean;
  idFeatureToEdit: number;
  idReleaseToEdit: number;
  restrictedDrop2: any = null;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

                this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
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
    $('#loading_for_features').show();
    $('#loading_for_releases').show();
    $('#addFeatureDiv').addClass('margin_to_loading');
    $('#addReleaseDiv').addClass('margin_to_loading');
    this._replanAPIService.getFeaturesProject(this.idProject)
      .subscribe( data => {
        $('#loading_for_features').hide();
        $('#addFeatureDiv').removeClass('margin_to_loading');
        this.features = data.filter(f => f.release === 'pending');
      });
    this._replanAPIService.getReleasesProject(this.idProject)
      .subscribe( data => {
        $('#loading_for_releases').hide();
        $('#addReleaseDiv').removeClass('margin_to_loading');
        this.releases = data;
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
        });
  }

  editFeature(idFeature: number) {
    this.isEditFeatureButtonClicked = true;
    this._replanAPIService.getFeature(this.idProject, idFeature)
      .subscribe( data => {
        this.idFeatureToEdit = data.id;
        $('#edit-feature-modal').modal();
        $('#nameFeatureEdit').val(data.name);
        $('#descriptionFeatureEdit').val(data.description);
        $('#effortFeatureEdit').val(data.effort);
        $('#deadlineFeatureEdit').val(data.deadline);
        $('#priorityFeatureEdit').val(data.priority);
      });
  }

  editFeatureAPI() {
    this.formEditFeature.value.name = $('#nameFeatureEdit').val();
    this.formEditFeature.value.description = $('#descriptionFeatureEdit').val();
    this.formEditFeature.value.effort = $('#effortFeatureEdit').val();
    this.formEditFeature.value.deadline = $('#deadlineFeatureEdit').val();
    this.formEditFeature.value.priority = $('#priorityFeatureEdit').val();
    $('#edit-feature-modal').modal('hide');
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.idFeatureToEdit)
        .subscribe( data => {
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              this.features = data2.filter(f => f.release === 'pending');
            });
        });
  }

  deleteFeature(idFeature: number) {
    this._replanAPIService.deleteFeature(this.idProject, idFeature)
      .subscribe( data => {
        this._replanAPIService.getFeaturesProject(this.idProject)
          .subscribe( data2 => {
            this.features = data2.filter(f => f.release === 'pending');
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
            });
        });
  }

  editRelease(idRelease: number) {
    this.isEditReleaseButtonClicked = true;
    this._replanAPIService.getRelease(this.idProject, idRelease)
      .subscribe( data => {
        this.idReleaseToEdit = data.id;
        $('#edit-release-modal').modal();
        $('#nameReleaseEdit').val(data.name);
        $('#descriptionReleaseEdit').val(data.description);
        if (data.starts_at) {
          data.starts_at = data.starts_at.substring(0, 10);
        }
        $('#starts_atReleaseEdit').val(data.starts_at);
        if (data.deadline) {
          data.deadline = data.deadline.substring(0, 10);
        }
        $('#deadlineReleaseEdit').val(data.deadline);
      });
  }

  editReleaseAPI() {
    this.formEditRelease.value.name = $('#nameReleaseEdit').val();
    this.formEditRelease.value.description = $('#descriptionReleaseEdit').val();
    this.formEditRelease.value.starts_at = $('#starts_atReleaseEdit').val();
    this.formEditRelease.value.deadline = $('#deadlineReleaseEdit').val();
    $('#edit-release-modal').modal('hide');
    this._replanAPIService.editRelease(JSON.stringify(this.formEditRelease.value), this.idProject, this.idReleaseToEdit)
        .subscribe( data => {
          this._replanAPIService.getReleasesProject(this.idProject)
            .subscribe( data2 => {
              this.releases = data2;
            });
        });
  }

  deleteRelease(idRelease: number) {
    this._replanAPIService.deleteRelease(this.idProject, idRelease)
      .subscribe( data => {
        this._replanAPIService.getReleasesProject(this.idProject)
          .subscribe( data2 => {
            this.releases = data2;
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

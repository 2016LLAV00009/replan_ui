import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DndModule} from 'ng2-dnd';

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
  receivedData: Array<any> = [];
  restrictedDrop2: any = null;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

                this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this._replanAPIService.getFeaturesProject(this.idProject)
                    .subscribe( data => {
                      this.features = data;
                    });
                  this._replanAPIService.getReleasesProject(this.idProject)
                    .subscribe( data => {
                      this.releases = data;
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
    this.isDeleteFeatureButtonClicked = false;
    this.isDeleteReleaseButtonClicked = false;
    this.isEditFeatureButtonClicked = false;
    this.isEditReleaseButtonClicked = false;
  }

  transferDataSuccess($event: any) {
      this.receivedData.push($event);
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
              this.features = data2;
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
    $('#edit-feature-modal').modal('hide');
    this._replanAPIService.editFeature(JSON.stringify(this.formEditFeature.value), this.idProject, this.idFeatureToEdit)
        .subscribe( data => {
          this._replanAPIService.getFeaturesProject(this.idProject)
            .subscribe( data2 => {
              this.features = data2;
            });
        });
  }

  deleteFeature(idFeature: number) {
    this._replanAPIService.deleteFeature(this.idProject, idFeature)
      .subscribe( data => {
        this._replanAPIService.getFeaturesProject(this.idProject)
          .subscribe( data2 => {
            this.features = data2;
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
        debugger;
        $('#edit-release-modal').modal();
        $('#nameReleaseEdit').val(data.name);
        $('#descriptionReleaseEdit').val(data.description);
        $('#starts_atReleaseEdit').val(data.starts_at);
        $('#deadlineReleaseEdit').val(data.deadline);
      });
  }

  editReleaseAPI() {
    $('#edit-release-modal').modal('hide');
    debugger;
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

}

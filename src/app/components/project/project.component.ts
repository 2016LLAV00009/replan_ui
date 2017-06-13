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

                this.formRelease = new FormGroup({
                  'name': new FormControl('', Validators.required),
                  'description': new FormControl('', Validators.required),
                  'starts_at': new FormControl('', Validators.required),
                  'deadline': new FormControl('', Validators.required)
                });

  }

  ngOnInit() {

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

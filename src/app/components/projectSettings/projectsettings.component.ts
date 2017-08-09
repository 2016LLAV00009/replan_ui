import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html'
})
export class ProjectSettingsComponent implements OnInit {

  formSkill: FormGroup;
  idProject: number;
  project: any;
  resources: any;
  skills: any;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {

              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this._replanAPIService.getProject(this.idProject)
                  .subscribe( data => {
                    this.project = data;
                  });
                  this._replanAPIService.getResourcesProject(this.idProject)
                  .subscribe( data => {
                    this.resources = data;
                  });
                  this._replanAPIService.getSkillsProject(this.idProject)
                  .subscribe( data => {
                    this.skills = data;
                  });
              });

              this.formSkill = new FormGroup({
                'name': new FormControl('', Validators.required),
                'description': new FormControl(''),
              });
  }

  ngOnInit() {
    $('.nav-settings').siblings().removeClass('active');
    $('.nav-settings').addClass('active');
  }

  getClass(availability: string) {
    const num = parseFloat(availability);
    if (num === 0) {
      return 'card-danger';
    } else if (num < 30) {
      return 'card-warning';
    } else {
        return 'card-success';
    }
  }

  deleteSkill(id: number) {
    this._replanAPIService.deleteSkillFromProject(this.idProject, id)
      .subscribe( data => {
        this._replanAPIService.getSkillsProject(this.idProject)
          .subscribe( data2 => {
            this.skills = data2;
          });
      });
  }

  addSkillModal() {
    $('#add-skill-modal').modal();
  }

  addNewSkill() {
    $('#add-skill-modal').modal('hide');
    this._replanAPIService.addSkillToProject(JSON.stringify(this.formSkill.value), this.idProject)
        .subscribe( data => {
          this._replanAPIService.getSkillsProject(this.idProject)
            .subscribe( data2 => {
              this.skills = data2;
            });
        });
  }

  addResourceModal() {
    //$('#add-resource-modal').modal();
  }

  editResourceModal() {
    //$('#edit-resource-modal').modal();
  }

  deleteResource(id: number) {
    this._replanAPIService.deleteResourceFromProject(this.idProject, id)
      .subscribe( data => {
        this._replanAPIService.getResourcesProject(this.idProject)
          .subscribe( data2 => {
            this.resources = data2;
          });
      });
  }

}
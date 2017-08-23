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
  formResource: FormGroup;
  formEditProject: FormGroup;
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

              this.formEditProject = new FormGroup({
                'effort_unit': new FormControl(''),
                'hours_per_effort_unit': new FormControl(''),
                'hours_per_week_and_full_time_resource': new FormControl('')
              });

              this.formSkill = new FormGroup({
                'name': new FormControl('', Validators.required),
                'description': new FormControl(''),
              });

              this.formResource = new FormGroup({
                'name': new FormControl('', Validators.required),
                'description': new FormControl(''),
                'availability': new FormControl('')
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

  editProject() {
      $('#edit-project-modal').modal();
      $('#edit_effort_unit').val(this.project.effort_unit);
      $('#edit_hours_per_effort_unit').val(this.project.hours_per_effort_unit);
      $('#edit_hours_per_week_and_full_time_resource').val(this.project.hours_per_week_and_full_time_resource);
  }

  editProjectAPI() {
    this.formEditProject.value.effort_unit = $('#edit_effort_unit').val();
    this.formEditProject.value.hours_per_effort_unit = $('#edit_hours_per_effort_unit').val();
    this.formEditProject.value.hours_per_week_and_full_time_resource = $('#edit_hours_per_week_and_full_time_resource').val();
    $('#edit-project-modal').modal('hide');
    this._replanAPIService.editProject(JSON.stringify(this.formEditProject.value), this.idProject)
      .subscribe( data => {
        this._replanAPIService.getProject(this.idProject)
          .subscribe( data2 => {
            this.project = data2;
          });
      });
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
    $('#add-resource-modal').modal();
  }

  addNewResource() {
    $('#add-resource-modal').modal('hide');
    this._replanAPIService.addResourceToProject(JSON.stringify(this.formResource.value), this.idProject)
        .subscribe( data => {
          this._replanAPIService.getResourcesProject(this.idProject)
            .subscribe( data2 => {
              this.resources = data2;
            });
        });
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
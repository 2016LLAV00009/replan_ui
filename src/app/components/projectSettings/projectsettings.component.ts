import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DndModule} from 'ng2-dnd';

declare var $: any;

@Component({
  selector: 'app-projectsettings',
  templateUrl: './projectsettings.component.html'
})
export class ProjectSettingsComponent implements OnInit {

  formSkill: FormGroup;
  formResource: FormGroup;
  formEditProject: FormGroup;
  formEditResource: FormGroup;
  idProject: number;
  project: any;
  resources: any;
  resourceToEdit: any;
  skills: any;
  skillsNotAssigned: any;
  skillsToAssign: any;

  constructor(private _replanAPIService: replanAPIService,
              private activatedRoute: ActivatedRoute) {
              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
              });

              this.formEditProject = new FormGroup({
                'effort_unit': new FormControl(''),
                'hours_per_effort_unit': new FormControl(''),
                'hours_per_week_and_full_time_resource': new FormControl('')
              });

              this.formSkill = new FormGroup({
                'name': new FormControl(''),
                'description': new FormControl(''),
              });

              this.formResource = new FormGroup({
                'name': new FormControl(''),
                'description': new FormControl(''),
                'availability': new FormControl('')
              });

              this.formEditResource = new FormGroup({
                'name': new FormControl(''),
                'description': new FormControl(''),
                'availability': new FormControl('')
              });
  }

  ngOnInit() {
    $('#loading_for_project').show();
    $('.project-information-container').hide();
    this._replanAPIService.getProject(this.idProject)
    .subscribe( data => {
      this.project = data;
    });
    this._replanAPIService.getResourcesProject(this.idProject)
    .subscribe( data => {
      this.resources = data;
      if (this.resources.length === 0) {
        $('.resources-span').text('No resources found');
      }
    });
    this._replanAPIService.getSkillsProject(this.idProject)
    .subscribe( data => {
      this.skills = data;
      if (this.skills.length === 0) {
        $('.skills-span').text('No skills found');
      }
      $('#loading_for_project').hide();
      $('.project-information-container').show();
    });

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
            if (this.skills.length === 0) {
              $('.skills-span').text('No skills found');
            }
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
              if (this.skills.length === 0) {
                $('.skills-span').text('No skills found');
              } else {
                $('.skills-span').text('');
              }
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
              if (this.resources.length === 0) {
                $('.resources-span').text('No resources found');
              } else {
                $('.resources-span').text('');
              }
            });
        });
  }

  editResource(idResource: number) {
    const self = this;
    this.skillsNotAssigned = [];
    this.skillsToAssign = [];
    this.resourceToEdit = this.resources.filter(f => f.id === idResource)[0];
    this.resourceToEdit.skills.forEach(skill => {
      this.skillsToAssign.push(skill);
    });
    this.skills.forEach(skill => {
      if (!self.skillsToAssign.some(x => x.id === skill.id )) {
        self.skillsNotAssigned.push(skill);
      }
    });
    $('#edit-resource-modal').modal();
    if (this.resourceToEdit !== undefined) {
      $('#nameResourceEdit').val(this.resourceToEdit.name);
      $('#availabilityResourceEdit').val(this.resourceToEdit.availability);
      $('#descriptionResourceEdit').val(this.resourceToEdit.description);
    }
  }

  editResourceAPI() {
    this.formEditResource.value.name = $('#nameResourceEdit').val();
    this.formEditResource.value.availability = $('#availabilityResourceEdit').val();
    this.formEditResource.value.description = $('#descriptionResourceEdit').val();
    $('#edit-resource-modal').modal('hide');
    let objArray = [];
    this.skillsToAssign.forEach(skill => {
      let obj = {
        id: skill.id
      };
      objArray.push(obj);
    });
    this._replanAPIService.editResource(JSON.stringify(this.formEditResource.value), this.idProject, this.resourceToEdit.id)
        .subscribe( data => {
          this._replanAPIService.getResourcesProject(this.idProject)
            .subscribe( data2 => {
              this.resources = data2;
              if (this.resources.length === 0) {
                $('.resources-span').text('No resources found');
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

  deleteResource(id: number) {
    this._replanAPIService.deleteResourceFromProject(this.idProject, id)
      .subscribe( data => {
        this._replanAPIService.getResourcesProject(this.idProject)
          .subscribe( data2 => {
            this.resources = data2;
            if (this.resources.length === 0) {
              $('.resources-span').text('No resources found');
            }
          });
      });
  }

}
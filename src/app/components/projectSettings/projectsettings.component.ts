import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { GlobalDataService } from '../../services/globaldata.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from '../../app.constants';
import { CustomValidators } from 'ng2-validation';
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
  skillsModified: any;

  constructor(private _replanAPIService: replanAPIService,
              private globaldata: GlobalDataService,
              private activatedRoute: ActivatedRoute) {
              this.activatedRoute.params.subscribe( params => {
                  this.idProject = params['id'];
                  this.globaldata.setCurrentProjectId(this.idProject);
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
    const self = this;
    $('#loading_for_project').show();
    $('#loading_for_resources').hide();
    $('#loading_for_skills').hide();
    $('.project-information-container').hide();
    this._replanAPIService.getProject(this.idProject)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error loading project data. Try it again later.');
      }
      this.project = data;
    });
    this._replanAPIService.getResourcesProject(this.idProject)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error loading project resources data. Try it again later.');
      }
      this.resources = data;
      if (this.resources.length === 0) {
        $('.resources-span').text('No resources found');
      }
    });
    this._replanAPIService.getSkillsProject(this.idProject)
    .subscribe( data => {
      if (data.toString() === 'e') {
        $('#error-modal').modal();
        $('#error-text').text('Error loading project skills data. Try it again later.');
      }
      this.skills = data;
      if (this.skills.length === 0) {
        $('.skills-span').text('No skills found');
      }
      $('#loading_for_project').hide();
      $('.project-information-container').show();
    });

    $('.nav-settings').siblings().removeClass('active');
    $('.nav-settings').addClass('active');
    $('#add-skill-modal').on('hidden.bs.modal', function (e) {
      self.clearAddSkillModal();
    });
    $('#add-resource-modal').on('hidden.bs.modal', function (e) {
      self.clearAddResourceModal();
    });
  }

  getClass(availability: string) {
    const num = parseFloat(availability);
    if (num >= AppConstants.LOW_RESOURCE_AVAILABILITY && num <= AppConstants.MEDIUM_RESOURCE_AVAILABILITY) {
      return 'card-danger';
    } else if (num > AppConstants.MEDIUM_RESOURCE_AVAILABILITY && num <= AppConstants.HIGH_RESOURCE_AVAILABILITY) {
      return 'card-warning';
    } else {
        return 'card-success';
    }
  }

  editProject() {
      $('#edit-project-modal').modal();
      this.formEditProject.controls['effort_unit'].setValue(this.project.effort_unit);
      this.formEditProject.controls['hours_per_effort_unit'].setValue(this.project.hours_per_effort_unit);
      this.formEditProject.controls['hours_per_week_and_full_time_resource'].setValue(this.project.hours_per_week_and_full_time_resource);
  }

  editProjectAPI() {
    this.formEditProject.value.effort_unit = $('#edit_effort_unit').val();
    this.formEditProject.value.hours_per_effort_unit = $('#edit_hours_per_effort_unit').val();
    this.formEditProject.value.hours_per_week_and_full_time_resource = $('#edit_hours_per_week_and_full_time_resource').val();
    $('#edit-project-modal').modal('hide');
    this._replanAPIService.editProject(JSON.stringify(this.formEditProject.value), this.idProject)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error editing the project. Try it again later.');
        }
        this._replanAPIService.getProject(this.idProject)
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error loading project data. Try it again later.');
            }
            this.project = data2;
          });
      });
  }

  deleteSkill(id: number) {
    $('#loading_for_skills').show();
    $('#addSkillDiv').addClass('margin_to_loading');
    $('.skills-container').hide();
    $('#loading_for_resources').show();
    $('#addResourceDiv').addClass('margin_to_loading');
    $('.resources-container').hide();
    this._replanAPIService.deleteSkillFromProject(this.idProject, id)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error deleting the skill. Try it again later.');
        }
        this._replanAPIService.getSkillsProject(this.idProject)
        .subscribe( data2 => {
          if (data2.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error loading skills data. Try it again later.');
          }
          $('#loading_for_skills').hide();
          $('#addSkillDiv').removeClass('margin_to_loading');
          $('.skills-container').show();
          this.skills = data2;
          if (this.skills.length === 0) {
            $('.skills-span').text('No skills found');
          }
        });
        this._replanAPIService.getResourcesProject(this.idProject)
        .subscribe( data3 => {
          if (data3.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error loading resources data. Try it again later.');
          }
          this.resources = data3;
          if (this.resources.length === 0) {
            $('.resources-span').text('No resources found');
          }
          $('#loading_for_resources').hide();
          $('#addResourceDiv').removeClass('margin_to_loading');
          $('.resources-container').show();
        });
      });
  }

  addSkillModal() {
    $('#add-skill-modal').modal();
  }

  addNewSkill() {
    $('#add-skill-modal').modal('hide');
    $('.skills-span').text('');
    $('#loading_for_skills').show();
    $('#addSkillDiv').addClass('margin_to_loading');
    $('.skills-container').hide();
    this._replanAPIService.addSkillToProject(JSON.stringify(this.formSkill.value), this.idProject)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error creating the skill. Try it again later.');
          }
          this._replanAPIService.getSkillsProject(this.idProject)
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error loading skills data. Try it again later.');
            }
            $('#loading_for_skills').hide();
            $('#addSkillDiv').removeClass('margin_to_loading');
            $('.skills-container').show();
            this.skills = data2;
            if (this.skills.length === 0) {
              $('.skills-span').text('No skills found');
            }
          });
        });
  }

  addResourceModal() {
    const self = this;
    this.skillsModified = false;
    this.skillsNotAssigned = [];
    this.skillsToAssign = [];
    this.skills.forEach(skill => {
      self.skillsNotAssigned.push(skill);
    });
    $('#add-resource-modal').modal();
  }

  addNewResource() {
    $('#add-resource-modal').modal('hide');
    $('.resources-span').text('');
    $('#loading_for_resources').show();
    $('#addResourceDiv').addClass('margin_to_loading');
    $('.resources-container').hide();
    this._replanAPIService.addResourceToProject(JSON.stringify(this.formResource.value), this.idProject)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error creating the resource. Try it again later.');
          }
          if (this.skillsModified) {
            const objArray = [];
            this.skillsToAssign.forEach(skill => {
              const obj = {
                skill_id: skill.id
              };
              objArray.push(obj);
            });
            this._replanAPIService.addSkillsToResource(JSON.stringify(objArray), this.idProject, data.id)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error creating the resource. Try it again later.');
              }
              this._replanAPIService.getResourcesProject(this.idProject)
              .subscribe( data3 => {
                if (data3.toString() === 'e') {
                  $('#error-modal').modal();
                  $('#error-text').text('Error loading resources data. Try it again later.');
                }
                this.resources = data3;
                if (this.resources.length === 0) {
                  $('.resources-span').text('No resources found');
                }
                $('#loading_for_resources').hide();
                $('#addResourceDiv').removeClass('margin_to_loading');
                $('.resources-container').show();
              });
            });
          } else {
            this._replanAPIService.getResourcesProject(this.idProject)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading resources data. Try it again later.');
              }
              this.resources = data2;
              if (this.resources.length === 0) {
                $('.resources-span').text('No resources found');
              }
              $('#loading_for_resources').hide();
              $('#addResourceDiv').removeClass('margin_to_loading');
              $('.resources-container').show();
            });
          }
        });
  }

  editResource(idResource: number) {
    const self = this;
    this.skillsModified = false;
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
      this.formEditResource.controls['name'].setValue(this.resourceToEdit.name);
      this.formEditResource.controls['availability'].setValue(this.resourceToEdit.availability);
      this.formEditResource.controls['description'].setValue(this.resourceToEdit.description);
    }
  }

  editResourceAPI() {
    this.formEditResource.value.name = $('#nameResourceEdit').val();
    this.formEditResource.value.availability = $('#availabilityResourceEdit').val();
    this.formEditResource.value.description = $('#descriptionResourceEdit').val();
    $('#edit-resource-modal').modal('hide');
    $('#loading_for_resources').show();
    $('#addResourceDiv').addClass('margin_to_loading');
    $('.resources-container').hide();
    this._replanAPIService.editResource(JSON.stringify(this.formEditResource.value), this.idProject, this.resourceToEdit.id)
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error editing the resource. Try it again later.');
          }
          if (this.skillsModified) {
            this._replanAPIService.deleteSkillsFromResource(this.idProject, this.resourceToEdit.id, this.resourceToEdit.skills)
              .subscribe( data2 => {
                if (data2.toString() === 'e') {
                  $('#error-modal').modal();
                  $('#error-text').text('Error editing the resource. Try it again later.');
                }
                const objArray = [];
                this.skillsToAssign.forEach(skill => {
                  const obj = {
                    skill_id: skill.id
                  };
                  objArray.push(obj);
                });
                this._replanAPIService.addSkillsToResource(JSON.stringify(objArray), this.idProject, this.resourceToEdit.id)
                .subscribe( data3 => {
                  if (data3.toString() === 'e') {
                    $('#error-modal').modal();
                    $('#error-text').text('Error editing the resource. Try it again later.');
                  }
                  this._replanAPIService.getResourcesProject(this.idProject)
                  .subscribe( data4 => {
                    if (data4.toString() === 'e') {
                      $('#error-modal').modal();
                      $('#error-text').text('Error loading resources data. Try it again later.');
                    }
                    this.resources = data4;
                    if (this.resources.length === 0) {
                      $('.resources-span').text('No resources found');
                    }
                    $('#loading_for_resources').hide();
                    $('#addResourceDiv').removeClass('margin_to_loading');
                    $('.resources-container').show();
                  });
                });
              });

          } else {
            this._replanAPIService.getResourcesProject(this.idProject)
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading resources data. Try it again later.');
              }
              this.resources = data2;
              if (this.resources.length === 0) {
                $('.resources-span').text('No resources found');
              }
              $('#loading_for_resources').hide();
              $('#addResourceDiv').removeClass('margin_to_loading');
              $('.resources-container').show();
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

  allowDropFunction(skills: any) {
    return (dragData: any) => !skills.some(skill => skill === dragData);
  }

  deleteResource(id: number) {
    $('#loading_for_resources').show();
    $('#addResourceDiv').addClass('margin_to_loading');
    $('.resources-container').hide();
    this._replanAPIService.deleteResourceFromProject(this.idProject, id)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error deleting the resource. Try it again later.');
        }
        this._replanAPIService.getResourcesProject(this.idProject)
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error loading resources data. Try it again later.');
            }
            $('#loading_for_resources').hide();
            $('#addResourceDiv').removeClass('margin_to_loading');
            $('.resources-container').show();
            this.resources = data2;
            if (this.resources.length === 0) {
              $('.resources-span').text('No resources found');
            }
          });
      });
  }

  clearAddSkillModal() {
    $('#nameSkill').val('');
    $('#descriptionSkill').val('');
  }

  clearAddResourceModal() {
    $('#nameResource').val('');
    $('#availabilityResource').val('');
    $('#descriptionResource').val('');
  }

}
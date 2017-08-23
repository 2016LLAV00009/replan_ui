import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '../../interfaces/project.interface';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  formProject: FormGroup;
  formEditProject: FormGroup;
  projects: any[] = [];
  idProjectToEdit: number;
  isEditButtonClicked: boolean;
  isDeleteButtonClicked: boolean;

  constructor( private _replanAPIService: replanAPIService,
               private router: Router) {

          this.formProject = new FormGroup({
              'name': new FormControl('', Validators.required),
              'description': new FormControl(''),
              'effort_unit': new FormControl('', Validators.required),
              'hours_per_effort_unit': new FormControl('', Validators.required),
              'hours_per_week_and_full_time_resource': new FormControl('', Validators.required)
            });

            this.formEditProject = new FormGroup({
                'effort_unit': new FormControl(''),
                'hours_per_effort_unit': new FormControl(''),
                'hours_per_week_and_full_time_resource': new FormControl('')
              });
   }


  ngOnInit() {
    $('#loading_for_projects').show();
    $('#addProjectDiv').addClass('margin_to_loading');
    this._replanAPIService.getProjectsAPI()
      .subscribe( data => {
        $('#loading_for_projects').hide();
        $('#addProjectDiv').removeClass('margin_to_loading');
        this.projects = data;
      });
    this.isDeleteButtonClicked = false;
    this.isEditButtonClicked = false;
  }

  goToProject(id: number) {
    if (!this.isEditButtonClicked && !this.isDeleteButtonClicked) {
      this.router.navigate( ['/project', id] );
    }
    this.isEditButtonClicked = false;
    this.isDeleteButtonClicked = false;
  }

  addProjectModal() {
    $('#add-project-modal').modal();
  }

  editProject(idProject: number) {
    this.isEditButtonClicked = true;
    this._replanAPIService.getProject(idProject)
      .subscribe( data => {
        this.idProjectToEdit = data.id;
        $('#edit-project-modal').modal();
        $('#edit_effort_unit').val(data.effort_unit);
        $('#edit_hours_per_effort_unit').val(data.hours_per_effort_unit);
        $('#edit_hours_per_week_and_full_time_resource').val(data.hours_per_week_and_full_time_resource);
      });
  }

  editProjectAPI() {
    this.formEditProject.value.effort_unit = $('#edit_effort_unit').val();
    this.formEditProject.value.hours_per_effort_unit = $('#edit_hours_per_effort_unit').val();
    this.formEditProject.value.hours_per_week_and_full_time_resource = $('#edit_hours_per_week_and_full_time_resource').val();
    $('#edit-project-modal').modal('hide');
    this._replanAPIService.editProject(JSON.stringify(this.formEditProject.value), this.idProjectToEdit)
        .subscribe( data => {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data2 => {
              this.projects = data2;
            });
        });
  }

  addNewProject() {
    $('#add-project-modal').modal('hide');
    this._replanAPIService.addProject(JSON.stringify(this.formProject.value))
        .subscribe( data => {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data2 => {
              this.projects = data2;
            });
        });
  }

  deleteProject(id: number) {
    this.isDeleteButtonClicked = true;
    this._replanAPIService.deleteProject(id)
      .subscribe( data => {
        this._replanAPIService.getProjectsAPI()
          .subscribe( data2 => {
            this.projects = data2;
          });
      });
  }

}

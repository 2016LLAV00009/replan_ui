import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Project } from '../../interfaces/project.interface';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  formProject: FormGroup;
  projects: any[] = [];
  idProjectToEdit: number;
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

   }


  ngOnInit() {
    const self = this;
    $('#loading_for_projects').show();
    $('#addProjectDiv').addClass('margin_to_loading');
    this._replanAPIService.getProjectsAPI()
      .subscribe( data => {
        $('#loading_for_projects').hide();
        $('#addProjectDiv').removeClass('margin_to_loading');
        this.projects = data;
        if (this.projects.length === 0) {
          $('.projects-span').text('No projects found');
        }
    });
    this.isDeleteButtonClicked = false;
    $('#add-project-modal').on('hidden.bs.modal', function (e) {
      self.clearModal();
    });
  }

  goToProject(id: number) {
    if (!this.isDeleteButtonClicked) {
      this.router.navigate( ['/projects', id] );
    }
    this.isDeleteButtonClicked = false;
  }

  addProjectModal() {
    $('#add-project-modal').modal();
  }

  addNewProject() {
    $('#add-project-modal').modal('hide');
    $('.projects-span').text('');
    $('#loading_for_projects').show();
    $('#addProjectDiv').addClass('margin_to_loading');
    $('.list-group-projects').hide();
    this._replanAPIService.addProject(JSON.stringify(this.formProject.value))
        .subscribe( data => {
          if (data.toString() === 'e') {
            $('#error-modal').modal();
            $('#error-text').text('Error creating the project. Try it again later.');
          }
          this._replanAPIService.getProjectsAPI()
            .subscribe( data2 => {
              if (data2.toString() === 'e') {
                $('#error-modal').modal();
                $('#error-text').text('Error loading projects data. Try it again later.');
              }
              $('#loading_for_projects').hide();
              $('#addProjectDiv').removeClass('margin_to_loading');
              $('.list-group-projects').show();
              this.projects = data2;
              if (this.projects.length === 0) {
                $('.projects-span').text('No projects found');
              }
            });
        });
  }

  deleteProject(id: number) {
    this.isDeleteButtonClicked = true;
    $('#loading_for_projects').show();
    $('#addProjectDiv').addClass('margin_to_loading');
    $('.list-group-projects').hide();
    this._replanAPIService.deleteProject(id)
      .subscribe( data => {
        if (data.toString() === 'e') {
          $('#error-modal').modal();
          $('#error-text').text('Error removing the project. Try it again later.');
        }
        this._replanAPIService.getProjectsAPI()
          .subscribe( data2 => {
            if (data2.toString() === 'e') {
              $('#error-modal').modal();
              $('#error-text').text('Error loading projects data. Try it again later.');
            }
            $('.list-group-projects').show();
            $('#loading_for_projects').hide();
            $('#addProjectDiv').removeClass('margin_to_loading');
            this.projects = data2;
            if (this.projects.length === 0) {
              $('.projects-span').text('No projects found');
            }
          });
      });
  }

  clearModal() {
    $('#nameProject').val('');
    $('#effort_unit').val('');
    $('#hours_per_effort_unit').val('');
    $('#hours_per_week_and_full_time_resource').val('');
    $('#descriptionProject').val('');
  }

}

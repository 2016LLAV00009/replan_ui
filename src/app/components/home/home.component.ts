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
  }

  goToProject(id: number) {
    if (!this.isDeleteButtonClicked) {
      this.router.navigate( ['/project', id] );
    }
    this.isDeleteButtonClicked = false;
  }

  addProjectModal() {
    $('#add-project-modal').modal();
  }

  addNewProject() {
    $('#add-project-modal').modal('hide');
    this._replanAPIService.addProject(JSON.stringify(this.formProject.value))
        .subscribe( data => {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data2 => {
              this.projects = data2;
              if (this.projects.length === 0) {
                $('.projects-span').text('No projects found');
              } else {
                $('.projects-span').text('');
              }
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
            if (this.projects.length === 0) {
              $('.projects-span').text('No projects found');
            }
          });
      });
  }

}

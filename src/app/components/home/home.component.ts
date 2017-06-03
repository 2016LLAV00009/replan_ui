import { Component, OnInit } from '@angular/core';
import { replanAPIService } from '../../services/replanAPI.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Project } from '../../interfaces/project.interface'

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  formProject:FormGroup;
  formEditProject:FormGroup;
  projects:any[] = [];
  idProjectToEdit: number;

  constructor( private _replanAPIService: replanAPIService,
               private router:Router) {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data =>{
              this.projects = data;
            });

          this.formProject = new FormGroup({
              'name': new FormControl('', Validators.required),
              'description': new FormControl(''),
              'effort_unit': new FormControl('', Validators.required),
              'hours_per_effort_unit': new FormControl('', Validators.required),
              'hours_per_week_and_full_time_resource': new FormControl('', Validators.required)
            })

            this.formEditProject = new FormGroup({
                'effort_unit': new FormControl(''),
                'hours_per_effort_unit': new FormControl(''),
                'hours_per_week_and_full_time_resource': new FormControl('')
              })
   }


  ngOnInit() {
  }

  goToProject(id:number) {
    this.router.navigate( ['/project', id] );
  }

  addProject() {
    $('#add-project-modal').modal();
  }

  editProject(idProject: number) {
    this._replanAPIService.getProject(idProject)
      .subscribe( data =>{
        this.idProjectToEdit = data.id;
        $('#edit-project-modal').modal();
        $('#edit_effort_unit').val(data.effort_unit);
        $('#edit_hours_per_effort_unit').val(data.hours_per_effort_unit);
        $('#edit_hours_per_week_and_full_time_resource').val(data.hours_per_week_and_full_time_resource);
      });
  }

  addNewProject() {
    $('#add-project-modal').modal('hide')
    this._replanAPIService.addProject(JSON.stringify(this.formProject.value))
        .subscribe( data => {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data =>{
              this.projects = data;
            });
        });
  }

  deleteProject(id: number) {
    this._replanAPIService.deleteProject(id)
      .subscribe( data => {
        this._replanAPIService.getProjectsAPI()
          .subscribe( data =>{
            this.projects = data;
          });
      });
  }

  editProjectAPI() {
    $('#edit-project-modal').modal('hide')
    this._replanAPIService.editProject(JSON.stringify(this.formEditProject.value), this.idProjectToEdit)
        .subscribe( data => {
          this._replanAPIService.getProjectsAPI()
            .subscribe( data => {
              this.projects = data;
            });
        });
  }

}

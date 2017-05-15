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
  projects:any[] = [];

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
   }


  ngOnInit() {
  }

  goToProject(id:number) {
    this.router.navigate( ['/project', id] );
  }

  addProject() {
    $('#add-project-modal').modal();
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

}

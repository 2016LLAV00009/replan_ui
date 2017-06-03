import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class replanAPIService {

  projectsURL:string = "http://replan-api.herokuapp.com/replan/projects/";

  constructor( private http:Http ) {  }

  getProjectsAPI() {
    let url = `${this.projectsURL}`;
    return this.http.get( url )
      .map(res=>res.json() );
  }

  addProject(project: string) {
    let url = this.projectsURL;
    let body = project;
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res=>{
        console.log(res.json());
        return res.json();
      })
  }

  deleteProject(id: number) {
    let url = this.projectsURL + id;
    return this.http.delete( url )
      .map(res => res.json())
  }

  editProject(project: string, idProject: number) {
    let url = this.projectsURL + idProject;
    let body = project;
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, { headers })
      .map(res=>{
        console.log(res.json());
        return res.json();
      })
  }

  getProject(id: number) {
    let url = this.projectsURL + id;
    return this.http.get( url )
      .map(res=>res.json() );
  }

  getFeaturesProject(id:number) {
    let url = this.projectsURL + id + "/features";
    return this.http.get( url )
      .map(res=>res.json() );
  }

  getReleasesProject(id:number) {
    let url = this.projectsURL + id + "/releases";
    return this.http.get( url )
      .map(res=>res.json() );
  }

  addFeatureToProject(feature: string, id: number) {
    let url = this.projectsURL + id + "/features/create_one";
    let body = feature;
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res=>{
        return res.json();
      })
  }

  addReleaseToProject(release: string, id: number) {
    let url = this.projectsURL + id + "/releases";
    let body = release;
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res=>{
        return res.json();
      })
  }

  deleteFeature(idProject: number, idFeature: number) {
    let url = this.projectsURL + idProject + "/features/" + idFeature;
    return this.http.delete( url )
      .map(res => res.json())
  }

  deleteRelease(idProject: number, idRelease: number) {
    let url = this.projectsURL + idProject + "/releases/" + idRelease;
    return this.http.delete( url )
      .map(res => res.json())
  }

}

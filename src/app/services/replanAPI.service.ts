import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class replanAPIService {

  projectsURL: string = 'http://replan-api.herokuapp.com/replan/projects/';

  constructor( private http: Http ) {  }

  /* PROJECTS */

  getProjectsAPI() {
    const url = `${this.projectsURL}`;
    return this.http.get( url )
      .map(res => res.json() );
  }

  addProject(project: string) {
    const url = this.projectsURL;
    const body = project;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      });
  }

  deleteProject(id: number) {
    const url = this.projectsURL + id;
    return this.http.delete( url )
      .map(res => res.json());
  }

  editProject(project: string, idProject: number) {
    const url = this.projectsURL + idProject;
    const body = project;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      });
  }

  getProject(id: number) {
    const url = this.projectsURL + id;
    return this.http.get( url )
      .map(res => res.json() );
  }

  /* FEATURES */

  getFeaturesProject(id:number) {
    const url = this.projectsURL + id + '/features';
    return this.http.get( url )
      .map(res => res.json() );
  }

  getFeature(idProject: number, idFeature: number) {
    const url = this.projectsURL + idProject + '/features/' + idFeature;
    return this.http.get( url )
      .map(res => res.json() );
  }

  editFeature(feature: string, idProject: number, idFeature: number) {
    const url = this.projectsURL + idProject + '/features/' + idFeature;
    const body = feature;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      });
  }

  deleteFeature(idProject: number, idFeature: number) {
    const url = this.projectsURL + idProject + '/features/' + idFeature;
    return this.http.delete( url )
      .map(res => res.json());
  }

  addFeatureToProject(feature: string, id: number) {
    const url = this.projectsURL + id + '/features/create_one';
    const body = feature;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  addFeatureToRelease(idProject: number, idRelease: number, body: string) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease + '/features';
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  /* RELEASES */

  getReleasesProject(id:number) {
    const url = this.projectsURL + id + '/releases';
    return this.http.get( url )
      .map(res => res.json() );
  }

  getRelease(idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease;
    return this.http.get( url )
      .map(res => res.json() );
  }

  editRelease(release: string, idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease;
    const body = release;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      });
  }

  deleteRelease(idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease;
    return this.http.delete( url )
      .map(res => res.json());
  }

  addReleaseToProject(release: string, id: number) {
    const url = this.projectsURL + id + '/releases';
    const body = release;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  /* PLAN */

  getReleasePlan(idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease + '/plan';
    return this.http.get( url )
      .map(res => res.json() );
  }

  /* RESOURCES */

  getResourcesProject(id: number) {
    const url = this.projectsURL + id + '/resources';
    return this.http.get( url )
      .map(res => res.json() );
  }

  editResource(resource: string, idProject: number, idResource: number) {
    const url = this.projectsURL + idProject + '/resources/' + idResource;
    const body = resource;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  deleteResourceFromProject(idProject: number, idResource: number) {
    const url = this.projectsURL + idProject + '/resources/' + idResource;
    return this.http.delete( url )
      .map(res => res.json());
  }

  deleteResourcesFromRelease(idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease + '/resources';
    return this.http.delete( url )
      .map(res => res.json());
  }

  addResourceToProject(resource: string, id: number) {
    const url = this.projectsURL + id + '/resources';
    const body = resource;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  /* SKILLS */

  getSkillsProject(id:number) {
    const url = this.projectsURL + id + '/skills';
    return this.http.get( url )
      .map(res => res.json() );
  }

  deleteSkillFromProject(idProject: number, idSkill: number) {
    const url = this.projectsURL + idProject + '/skills/' + idSkill;
    return this.http.delete( url )
      .map(res => res.json());
  }

  addSkillToProject(skill: string, id: number) {
    const url = this.projectsURL + id + '/skills';
    const body = skill;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

}

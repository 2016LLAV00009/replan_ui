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
        return res.json();
      });
  }

  deleteSkillsFromFeature(idProject: number, idFeature: number, skills: any) {
    const url = this.projectsURL + idProject + '/features/' + idFeature + '/skills';
    let params = '?skill_id[]=';
    skills.forEach((item, index) => {
      if (index === 0) {
        params += skills[index].id;
      } else {
        params += '&skill_id[]=' + skills[index].id;
      }
    });
    return this.http.delete( url + params)
      .map(res => res.json());
  }

  addSkillsToFeature(skills: string, idProject: number, idFeature: number) {
    const url = this.projectsURL + idProject + '/features/' + idFeature + '/skills';
    const body = skills;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  deleteDependenciesFromFeature(idProject: number, idFeature: number, dependencies: any) {
    const url = this.projectsURL + idProject + '/features/' + idFeature + '/dependencies';
    let params = '?feature_id=';
    dependencies.forEach((item, index) => {
      if (index === dependencies.length - 1) {
        params += dependencies[index].id;
      } else {
        params += dependencies[index].id + ',';
      }
    });
    return this.http.delete( url + params)
      .map(res => res.json());
  }

  addDependenciesToFeature(dependencies: string, idProject: number, idFeature: number) {
    const url = this.projectsURL + idProject + '/features/' + idFeature + '/dependencies';
    const body = dependencies;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
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
        return res.json();
      });
  }

  deleteResourcesFromRelease(idProject: number, idRelease: number, resources: any) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease + '/resources';
    let params = '?ResourceId=';
    resources.forEach((item, index) => {
      if (index === resources.length - 1) {
        params += resources[index].id;
      } else {
        params += resources[index].id + ',';
      }
    });
    return this.http.delete( url + params )
      .map(res => res.json());
  }

  addResourcesToRelease(resources: string, idProject: number, idRelease: number) {
    const url = this.projectsURL + idProject + '/releases/' + idRelease + '/resources';
    const body = resources;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
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

  deleteSkillsFromResource(idProject: number, idResource: number, skills: any) {
    const url = this.projectsURL + idProject + '/resources/' + idResource + '/skills';
    let params = '?skillId=';
    skills.forEach((item, index) => {
      if (index === skills.length - 1) {
        params += skills[index].id;
      } else {
        params += skills[index].id + ',';
      }
    });
    return this.http.delete( url + params )
      .map(res => res.json());
  }

  addSkillsToResource(skills: string, idProject: number, idResource: number) {
    const url = this.projectsURL + idProject + '/resources/' + idResource + '/skills';
    const body = skills;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers })
      .map(res => {
        return res.json();
      });
  }

  deleteResourceFromProject(idProject: number, idResource: number) {
    const url = this.projectsURL + idProject + '/resources/' + idResource;
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

import { Injectable } from '@angular/core';

@Injectable()
export class GlobalDataService {

  currentProjectId: number = null;

  getCurrentProjectId() {
    return this.currentProjectId;
  }

  setCurrentProjectId(projectId: number) {
    this.currentProjectId = projectId;
  }

  resetCurrentProjectId() {
    this.currentProjectId = null;
  }

}

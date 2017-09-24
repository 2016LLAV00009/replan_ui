import { Injectable } from '@angular/core';

@Injectable()
export class GlobalDataService {

  currentProjectId: any = null;
  currentReleaseId: any = null;

  getCurrentProjectId() {
    return this.currentProjectId;
  }

  setCurrentProjectId(projectId: number) {
    this.currentProjectId = projectId;
  }

  resetCurrentProjectId() {
    this.currentProjectId = null;
  }

  getCurrentReleaseId() {
    return this.currentReleaseId;
  }

  setCurrentReleaseId(releaseId: number) {
    this.currentReleaseId = releaseId;
  }

  resetCurrentReleaseId() {
    this.currentReleaseId = null;
  }

}

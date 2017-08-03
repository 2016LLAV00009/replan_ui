import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectComponent } from './components/project/project.component';
import { PlanComponent } from './components/plan/plan.component';
import { ProjectSettingsComponent } from './components/projectSettings/projectsettings.component';

const app_routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'project/:id/settings', component: ProjectSettingsComponent },
  { path: 'project/:id/release/:id2/plan', component: PlanComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const app_routing = RouterModule.forRoot(app_routes);

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {DndModule} from 'ng2-dnd';
import { CustomFormsModule } from 'ng2-validation';

// Routes
import { app_routing } from './app.routes';

// Services
import { replanAPIService } from './services/replanAPI.service';
import { GlobalDataService } from './services/globaldata.service';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectComponent } from './components/project/project.component';
import { PlanComponent } from './components/plan/plan.component';
import { ProjectSettingsComponent } from './components/projectSettings/projectsettings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProjectComponent,
    PlanComponent,
    ProjectSettingsComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule,
    HttpModule,
    app_routing,
    DndModule.forRoot()
  ],
  providers: [
    replanAPIService,
    GlobalDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

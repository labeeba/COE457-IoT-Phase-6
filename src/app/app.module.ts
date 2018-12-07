// All component imports to be declared in the main app module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './/app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxLoadingModule } from 'ngx-loading';
import { MunicipalityComponent } from './municipality/municipality.component';


@NgModule({     //The NgModule decorator which brings all the app's components and services together
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    MapComponent,
    LandingComponent,
    MunicipalityComponent,
  
  ],
  imports: [  //all module imports like HttpClient and Forms and Spinners
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    NgxLoadingModule.forRoot({}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDlJNuZhbo2YJALY3BqrnIO0iNEEtl2nZI'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { MunicipalityComponent } from './municipality/municipality.component';
import { HomeComponent } from './home/home.component';

//defining the angular routes that this single page application would visit
const routes: Routes = [
  { path:'', component:LandingComponent},
  { path: 'login', component:LoginComponent  },
  { path: 'municipality', component:MunicipalityComponent  },
  { path: 'signup', component:SignupComponent  },
 {path: 'home', component:HomeComponent} ,
  //can activate basically is a guard to the path which calls the component AuthGuard before navigating to the path
  { path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard]  },

];

@NgModule({ //Module decorator which consolidates providers and components
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)  //providing the router module at the root level so routes are available in any component
  ],
  exports: [ RouterModule ],  //exporting router module with this module to the app.module.ts
  providers: [AuthGuard]
})
export class AppRoutingModule { }

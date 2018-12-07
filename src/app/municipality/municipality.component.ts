import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.css']
})
export class MunicipalityComponent implements OnInit {
  user = {    //setting a user object which will be bound to the template's form input
  username: '',
  password: ''
};
public loading = false;   //a boolean to turn the loading spinner on/off
private authStatusSub: Subscription;  // A subscription to the auth service to check if user is authenticated

  constructor(private http: HttpClient,private router:Router,private authService:AuthService,
    private spinner: NgxSpinnerService) { }
  
  //angular's lifecycle hook which is used for initialization logic, as soon as the component is created
  ngOnInit() {
    //subscribing to the status of authentication in the provider to set the flag boolean to false
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false;
      }
    );
  } 

  //method which is executed when the user clicks on the login button and receives a template form
  onLogin(form: NgForm){
    if(form.valid){ //checking if the form received is valid or not
      this.loading = true; 
      this.authService.login(this.user.username,this.user.password);  //calling the login method of the auth service with values set by the form through two way data binding
      console.log('Here at last');
    }
    
  }

}

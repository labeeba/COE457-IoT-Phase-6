import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = {  //the user object whose values will be set through the form using 2 way data binding
    username: '',
    email:'',
    password:'',
    location:''
  }

  //class constructor setting class variables to use http and angular client
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  //the method which will be called when the user clicks on the signup button and receives a reference to the entire form
  onSignup(form:NgForm){
    console.log('Clicked');

    /*
      the angular httpclient's post method which posts a request with the user object as the body of the request to the given url which is our node server
      we subscribe to get the response because it is an asynchronous task and when the reponse comes we use 
      angular router to navigate us to the dashboard.
      subscribe is used in angular to subscribe to subjects or observables which are used in asynchronous tasks like promises
    */
    this.http.post('http://localhost:3000/registerAttempt',this.user).subscribe(response=>{
      console.log(response);
      this.router.navigate(['/dashboard']);
    });
  }

}

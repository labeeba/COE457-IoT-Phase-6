import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

//service provided at the root level for every component to access
@Injectable({
  providedIn: 'root'
})

//Auth service is basically a service to aid in authentication logic
export class AuthService {
    isAuthenticated = false;    //a class variable to see if user is authenticated or not
    private authStatusListener = new Subject<boolean>();    //a subject to which classes will subscribe to check if authentication has been yet or not

    constructor(private http:HttpClient, private router:Router ){}

    //method to return the auth listener subject as an observable
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }
    
    //login method which sends a post request to the server to see if user credentials are correct or not
    login(username:string,password:string){
        this.http.post<{response:string}>('http://localhost:3000/loginAttempt',{username:username,password:password}).subscribe(response=>{
            //checking if the server response is successful or not
            if(response.response == 'success'){
              console.log('Authenticated');
              //Important: New way to use user sessions, by using client side sessionStorage which makes user sessions easier in angular
              sessionStorage.setItem('user',username);
              this.isAuthenticated = true;
              //sending a new message on the subject to true which will hide spinners in the listening components
              this.authStatusListener.next(true);
              //successful auth should make the angular router navigate us to the dashboard
              this.router.navigate(['/dashboard']);
            }
        });
    }

    //logout method which will log the user out
    logout(){
        this.http.get<{response:string}>('http://localhost:3000/signout').subscribe(response=>{
            if(response.response == 'success'){
                console.log('is Auth is:'+this.isAuthenticated);
                console.log('Logged out');
                //removing the user from the sessionStorage which technically ends the user's session
                sessionStorage.removeItem('user');
                this.isAuthenticated = false;
                this.authStatusListener.next(false);
                //navigate to the root path
                this.router.navigate(['/']);
            }
        });
    }

    getIsAuth(){
        return this.isAuthenticated;
    }
}
import { Component, OnInit , ViewChild,NgZone } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
//importing the mqtt client from npm package mqtt
import { connect, Client, IConnackPacket,IClientPublishOptions } from 'mqtt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

//the main page for a user when they login/signup which has the map component within it
export class DashboardComponent implements OnInit {
  public loading = false;
  private authStatusSub: Subscription;
  date;
  // pins; //the array for locations
  // bins; //the array for bins
  // show = false;
  // bin_list = []; //an array with the bin object and a show flag for each to display when the mouse hovers over
  // pin_list=[];
  // countbins;
  // countpins;
  // client:Client;  //mqtt client
  // zone:any;
  //arrays for days and months to display to the user
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];

  constructor(private http: HttpClient,private authService:AuthService) {
    // this.zone = new NgZone({ enableLongStackTrace: false });

    // //creating an mqtt client and connecting to hivemq through websockets
    // this.client = connect('mqtt://broker.hivemq.com/mqtt',{port:8000});

    // //function which will be called when the connection is made
    // this.client.on('connect', ()=>{
    //   console.log('connected to mqtt broker');
    //   // this.mqtt_connected = true;
    // });

    // //callback function when mqtt message is received
    // this.client.on('message', (topic: string, payload: string) => {
    //   console.log(`message from ${topic}: ${payload}`);
    //   //parsing the stringified JSON payload received
    //   var newLocation = JSON.parse(payload);
    //   //adding the new location to the marked locations array
    //   this.pins.push(newLocation);
    // });
   }

  //angular lifecycle hook which executes logic upon creation of the component itself
  ngOnInit() {
    //setting the date which will be displayed to the user via string interpolation feature of angular
    const day = this.days[new Date().getDay()];
    const month = this.months[new Date().getMonth()];
    const date = new Date().getDate();
    const year = new Date().getFullYear();
    this.date = `${day}, ${month} ${date}, ${year}`;  

    //logic for setting the spinner on/off when the user logs out
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.loading = false;
      }
    );

    // this.client.subscribe('trashmanage/newlitter');

    // //initializing the bins array with all bins from the database
    // this.http.get('http://localhost:3000/getbins').subscribe(response=>{
    //   this.bins = response;
    //   this.bins.forEach(bin=>{
    //     this.bin_list.push({bin:bin,show:false}); //adding the bin and a show property for each bin
    //   });
    // });

    // //getting all locations marked by users using their watches from the database through the server
    // this.http.get('http://localhost:3000/getpins').subscribe(response=>{
    //   // console.log(this.pins);
    //   this.pins = response;
    //   this.pins.forEach(pin=>{
    //     this.pin_list.push({pin:pin,show:false});
    // });
  // });

  // this.countpins= this.pin_list.length;
  // this.countbins= this.pin_list.length;



    
  }

  //method which will be executed when the user clicks on the sign out button
  onSignout(){
    this.loading = true;
    this.authService.logout();  //calling the logout method of the auth service
  }


}

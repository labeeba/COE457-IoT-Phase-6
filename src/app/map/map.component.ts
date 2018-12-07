import { Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//importing the mqtt client from npm package mqtt
import { connect, Client, IConnackPacket,IClientPublishOptions } from './browserMqtt';

declare let L;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  //setting a random center for the map to initialize to 
  dubai_airport = { lat: 25.2532, lng: 55.3657 };

  //setting a custom icon for the bins
  redbin='../assets/img/redbin.png';
  greenbin='../assets/img/greenbin.png';
  yellowbin= '../assets/img/yellowbin.png';
  pins; //the array for locations
  bins; //the array for bins
  show = false;
  bin_list = []; //an array with the bin object and a show flag for each to display when the mouse hovers over
  pin_list=[];
  client:Client;  //mqtt client
  zone:any;

  //the constructor
  constructor(private http: HttpClient) { 
    //initializing the angular zone to render live changes of class variables without refreshing
    this.zone = new NgZone({ enableLongStackTrace: false });

    //creating an mqtt client and connecting to hivemq through websockets
    this.client = connect('mqtt://broker.hivemq.com/mqtt',{port:8000});

    //function which will be called when the connection is made
    this.client.on('connect', ()=>{
      console.log('connected to mqtt broker');
      // this.mqtt_connected = true;
    });

    //callback function when mqtt message is received
    this.client.on('message', (topic: string, payload: string) => {
      console.log(`message from ${topic}: ${payload}`);
      //parsing the stringified JSON payload received
      var newLocation = JSON.parse(payload);
      //adding the new location to the marked locations array
      this.pins.push(newLocation);
    });
   }
  
  //function which is called when mouse hovers over the bin icon marker to display an infoWindow
  onMouseOver(bin, pin) {
    console.log(bin);
    console.log(this.bin_list);
    console.log(pin);
    console.log(this.pin_list);
    bin.show = true;  //setting the show property to true when mouse hovers over
    pin.show= true;
  }

  onMouseOut(bin, pin){  //when mouse leaves, set the show property to false to hide the info window
    bin.show = false;
    pin.show= false;
  }

  

  //initialization logic when the component is created
  ngOnInit() {
    //subscribing to the topic new litter when a user uses smart watch to mark a new location as littered it will show up on the browser
    this.client.subscribe('trashmanage/newlitter');

    //initializing the bins array with all bins from the database
    this.http.get('http://localhost:3000/getbins').subscribe(response=>{
      this.bins = response;
      this.bins.forEach(bin=>{
        this.bin_list.push({bin:bin,show:false}); //adding the bin and a show property for each bin
      });
    });

    //getting all locations marked by users using their watches from the database through the server
    this.http.get('http://localhost:3000/getpins').subscribe(response=>{
      // console.log(this.pins);
      this.pins = response;
      this.pins.forEach(pin=>{
        this.pin_list.push({pin:pin,show:false});
    });
  });
}
}

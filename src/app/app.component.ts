import { Component } from '@angular/core';

@Component({  //component decorator to declare this as a component
  selector: 'app-root', //the selector which will be used in index.html
  templateUrl: './app.component.html',  //link to the actual template
  styleUrls: ['./app.component.css']  //link to the css for this page
})
export class AppComponent {
  title = 'app';
}

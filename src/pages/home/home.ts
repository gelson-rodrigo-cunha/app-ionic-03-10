import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http, Headers } from '@angular/http'
import {LocationTrackerProvider} from "../../providers/location-tracker/location-tracker";
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
//import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Destination: any = '';
  MyLocation: any;
	public data:any;
 
  constructor(public navCtrl: NavController, public locationTracker: LocationTrackerProvider, public alertCtrl: AlertController, public http: Http)
  {
	//  setInterval(this.start(),1000);
 const data = JSON.parse(localStorage.getItem('userData'));
 // console.log(data);
  	let header = new Headers();
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + data);
  
  this.http.get('http://localhost:8000/api/postsshow', {headers: header})
  	.map(res => res.json())
  	.subscribe(
  		data => {
  			console.log(data);
  			this.data = data;
  		},
  		err => {
  			console.log('error')
  		}
  		);

	    var temp = this;
    var i = 0;
    setInterval(function(){ 
        temp.locationTracker.startTracking()
    }, 1000);
	
	
	
  }

  postDetalhes(req) {
  let alert = this.alertCtrl.create({
     title: 'Detalhes da notícia',
     subTitle: req.description,
     buttons: ['Fechar']
   });
   alert.present();
 }



 public start() {
    this.locationTracker.startTracking();
  }
  
}

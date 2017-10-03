import {Injectable, NgZone} from '@angular/core';
import {BackgroundGeolocation, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/filter';

let apiUrl = 'http://localhost:8000/api/localizations/';
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  
  constructor(
    public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation,
    public geolocation: Geolocation,
	public http: Http
  ) {
//setInterval(this.startTracking(),1000);
  }

  public startTracking() {

    let config : BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
     // interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
	
      });
    }, (err) => {
      console.log(err);
      });

    this.backgroundGeolocation.start();

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);

      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

	  //this.enviaLocal(position.coords);
	   const data = JSON.parse(localStorage.getItem('userData'));
 // console.log(data);
  	let header = new Headers();

   var dataLocalizacao = { latitude: this.lat, longitude: this.lng, idUser: 1 };
     console.log(dataLocalizacao);
     header.append('Accept', 'application/json');
     header.append('Authorization', 'Bearer ' + data);
	  return new Promise((resolve, reject) =>{
      //let headers = new Headers();
      this.http.post(apiUrl,dataLocalizacao, {headers: header}).
      subscribe(result =>{
        resolve(result.json());
      }, (err) =>{
        reject(err);
      });

    });
	  
    });
  }

  public stopTracking() {
    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
}

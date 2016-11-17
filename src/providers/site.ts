import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



/*
  Generated class for the Site provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Site {
  private sites: Array<{}>;
  private siteID;

  constructor(public http: Http) {
  }

  getSites(){
    if (this.sites){
      return Promise.resolve(this.sites);
    }

    return new Promise((resolve, reject)=>{
      this.http.get('https://api.myjson.com/bins/4kwpm')
      .map(response => response.json())
      .subscribe((sites)=>{
        this.sites = sites;
        resolve(sites);
      });
    });
    
  }

  findSite(site){
    return site.id == this.siteID;
  }

  getSite(siteID){
    this.siteID = siteID;
    return this.sites.find(this.findSite, this);
  }

}

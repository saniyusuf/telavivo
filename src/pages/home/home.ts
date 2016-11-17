import { Component } from '@angular/core';
import 'rxjs/add/operator/map';

import { NavController } from 'ionic-angular';

import { SiteDetail} from '../site-detail/site-detail';
import { Site } from '../../providers/site';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sites: Array<{}>;

  constructor(public navCtrl: NavController, private site: Site) {}

  ionViewDidLoad(){
    this.site.getSites()
    .then((sites)=> this.sites = sites);
  }

  goToSiteDetails(siteID){
    this.navCtrl.push(SiteDetail, {
      siteID: siteID
    });
  }

}

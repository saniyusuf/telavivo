import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Site } from '../../providers/site';

/*
  Generated class for the SiteDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-site-detail',
  templateUrl: 'site-detail.html'

})

export class SiteDetail {
  siteID;
  siteDetail: any;

  constructor(private navParams: NavParams, private site: Site) {
    this.siteID = navParams.get('siteID');
  }

  ionViewDidLoad() {
    this.siteDetail = this.site.getSite(this.siteID);
  }


}

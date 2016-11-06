import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private englishConversation = {
    food: 'Where do I get food?',
    hotel: 'How do I get to Ben Yehuda St?',
    buy: 'How much is this?',
    adapter: 'Where can I get a power adapter?',
    enable: 'Enable Hebrew',
    title: 'Conversation'
  };

   private hebrewConversation = {
    food: 'איפה אני מקבל מזון?',
    hotel: 'כיצד אוכל להגיע רחוב בן יהודה?',
    buy: 'כמה זה עולה?',
    adapter: 'איפה אני יכול להשיג מתאם מתח?',
    enable: "אפשר אנגלית",
    title: "שִׂיחָה"
  };

  private conversation;
  private isHebrewEnabled = false;

  constructor(private platfrom: Platform) {
    this.conversation = this.englishConversation;
    if(platfrom.isRTL){    
      platfrom.setDir('ltf', true);
    }
  }

  ionViewDidLoad(){}

  changeLanguage(){
    this.isHebrewEnabled ? this.setHebrew() : this.setEnglish();
  }

  setHebrew(){
    this.conversation = this.hebrewConversation;
    this.platfrom.setDir('rtl', true);
  }

  setEnglish(){
    this.conversation = this.englishConversation;
    this.platfrom.setDir('ltr', true)
  }

}

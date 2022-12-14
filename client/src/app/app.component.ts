import { PresenceService } from './_services/presence.service';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;

  constructor(private accountService: AccountService, private presenceService: PresenceService) { }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }

  }

}

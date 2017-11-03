import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects;
  user;

  constructor(private db: AngularFireDatabase, private userSvc: UserService) { }

  ngOnInit() {
    this.user = this.userSvc.verifyUser();
    this.db.list(`/users/${this.user.uid}/projects`)
      .subscribe(event => {
        this.db.object(`/projects/${event[0].$value}`)
          .subscribe(event => {
            this.projects = event;
          });
      });
  }
}

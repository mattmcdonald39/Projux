import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../services/teams.service';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  teamName = 'foobar';
  teamRef;
  team;
  users = [];
  constructor(private route: ActivatedRoute, private teamSvc: TeamService, private userSvc: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamSvc.getTeam(params.$value)
      .then(snap => {
        this.team = snap.val();
      })
      .then(() => {
        this.team.users.forEach(user => {
          return this.userSvc.getUser(user)
          .then(snapshot => {
            this.users.push(snapshot.val());
          });;
        });
      });
    });
  }
}

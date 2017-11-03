import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from '../services/teams.service';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { ProjectCardComponent, CardItem } from '../project-card/project-card.component';
import { EditListCardComponent } from '../edit-list-card/edit-list-card.component';
import { CustomEditCardComponent} from '../custom-edit-card/custom-edit-card.component';
import * as firebase from 'firebase';

export class Team {
  name: string = '';
  users: any[];
  projects: any[];
  company: string;
  icon: string;
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: Team[];
  list: CardItem[];
  newTeamMode: boolean = false;
  editMode: boolean = false;
  deletePrompt = false;
  editedTeam: Team;
  newTeam: Team;
  selectedUsers: any[] = [];
  suggestedUsers: string[] = [];
  usersListBox;


  constructor(
      private teamSvc: TeamService, 
      private userSvc: UserService, 
      private companySvc: CompanyService, 
      private route: ActivatedRoute
    ) { 
    this.newTeam = new Team();
    this.editedTeam = new Team();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.$value === 'new'){
        this.newTeamMode = true;
      } else if (params.$value) {
        this.teamSvc.getTeam(params.$value)
          .then(team => {
            this.editedTeam = team.val();
            this.editMode = true;
          });
      } 
    });

    this.teamSvc.getAllTeams()
    .subscribe(teams => {
      this.teams = teams;
      this.list = teams.map(t => {
        let item = new CardItem();
        item.value = t.name;
        item.label = t.name;
        return item;
      })
    });

    this.userSvc.getUsers()
    .subscribe(users => {
      this.usersListBox = users.map(user => {
        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user.uid
        }
      })
    });
  }

  triggerNewTeam() {
    this.selectedUsers = [];
    this.newTeamMode = true
  }

  trackByIndex(index: number, obj: any) {
    return index;
  }

  increaseUsers() {
    this.selectedUsers.push({label: 'select user', value: null});
  }
  

  deleteTeam(team) {
    this.teamSvc.delete(team)
    .then(() => {
      this.editMode = false;
      this.editedTeam = new Team();
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  editTeam(teamName) {
    let team = this.teams.find(t => t.name === teamName);
    this.editedTeam = team;
    this.selectedUsers = team.users;
    this.editMode = true;
  }

  saveTeam() {
    this.teamSvc.saveTeam(this.editedTeam)
    .then(() => {
      this.editMode = false;
    });
  }

  addTeam() {
    let company;
    let admin = firebase.auth().currentUser;
    return this.companySvc.getCompanyNameByUserUid(admin.uid)
    .then(comp => {
      company = comp.val();
    })
    .then(() => {
      this.newTeam.users = this.selectedUsers;
      this.newTeam.company = company;
      return this.teamSvc.addTeam(this.newTeam);
    })
    .then(() => {
      this.newTeamMode = false
      this.newTeam = new Team();
      this.selectedUsers = [];
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  // this.cities.push({label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}});

  toggleNewTeamMode() {
    this.newTeamMode = !this.newTeamMode;
  }
}

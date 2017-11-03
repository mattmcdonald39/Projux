import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/teams.service';
import { UserService } from '../services/user.service';
import { ProjectsService } from '../services/projects.service';
import { CompanyService } from '../services/company.service';
import { Team } from '../teams/teams.component';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Router, Params } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { ProjectCardComponent, CardItem } from '../project-card/project-card.component';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  teams: CardItem[];
  projects: CardItem[];
  user;
  companies: any[] = [];
  selectedCompany;
  newProjectName: string;
  promptNewProject: boolean = false;
  tabMenuItems: any[] = [];
  selectedTab: string = 'company';

  constructor(
    private teamSvc: TeamService, 
    private userSvc: UserService,
    private companySvc: CompanyService,
    private projSvc: ProjectsService,
    private router: Router) { }

  ngOnInit() {
    // TODO replace this with only companies availalbe to this user
    this.tabMenuItems = [
      {label: 'Company', icon: 'ui-icon-account-balance', command: (onclick) => {this.selectedTab = 'company'}},
      {label: 'Projects', icon: 'ui-icon-assignment', value: 'projects', command: (onclick) => {this.selectedTab = 'projects'}},
      {label: 'Teams', icon: 'ui-icon-people', value: 'teams', command: (onclick) => {this.selectedTab = 'teams'}}
    ];
    this.companySvc.getAllCompaniesSnapshot()
      .then(snapshot => {
        let compList = snapshot.val();
        compList = Object.keys(compList);
        compList.forEach(comp => {
          this.companies.push({
            label: comp,
            value: comp
          })
        });
        this.selectedCompany = this.companies[0];
      })

    let loggedInUser = this.userSvc.verifyUser();
    this.userSvc.getUser(loggedInUser.uid).then(response => {
      this.user = response.val();
      this.selectedCompany = this.user.company;
      this.getCompanyInfo(this.user.company);
    })
  }

  getCompanyInfo(company){
    this.teamSvc.getTeamsByCompany(company)
    .subscribe(teams => {
      this.teams = teams.map(t => {
        let item = new CardItem();
        item.value = t.$value;
        item.label = t.$value;
        return item;
      });
    });
    this.projSvc.getProjectsByCompany(company)
    .subscribe(projects => {
      this.projects = projects.map(p => {
        let item = new CardItem();
        item.label = p.$value;
        item.value = p.$value;
        return item;
      })
    });
  }

  goToTeam(team) {
    this.router.navigate(['/teams'], {queryParams: team});
  }

  goToProject(project) {
    this.router.navigate(['/projects'], {queryParams: project});
  }
}

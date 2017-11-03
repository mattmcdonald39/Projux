import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import {MenuItem} from 'primeng/primeng';

export class Project {
  name: '';
  tasks: any[] = [];
  teams: any[] = [];
  company: '';
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  project: Project;
  teams: any[];
  tasks: any[];
  uxTabs: MenuItem[];
  editDescription: boolean = false;
  description: string = '';

  constructor(private route: ActivatedRoute, private projSvc: ProjectsService) { 
    this.project = new Project();
  }

  ngOnInit() {
    this.uxTabs = [
      {label: 'Discovery', icon: 'ui-icon-search'},
      {label: 'Research', icon: 'ui-icon-import-contacts'},
      {label: 'Design', icon: 'ui-icon-build'},
      {label: 'Test', icon: 'ui-icon-assessment'},
      {label: 'Demo', icon: 'ui-icon-people'},
  ];

    this.route.queryParams.subscribe(params => {
      if (params.$value) {
        this.projSvc.getProjectByName(params.$value)
        .then(snapshot => {
          let proj = snapshot.val();
          if (proj !== null){
            this.project = proj;
          } else {
            return this.projSvc.createProject(params.$value)
          }
        })
        .then(proj => {
          return this.projSvc.getProjectByName(params.$value);
        })
        .then(newProjSnapshot => {
          this.project = newProjSnapshot.val();
        });;
      };
    });
  };


  goToTeam(team){

  }
};

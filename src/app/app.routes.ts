import {Routes,RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DashboardDemo} from './demo/view/dashboarddemo';
import {SampleDemo} from './demo/view/sampledemo';
import {FormsDemo} from './demo/view/formsdemo';
import {DataDemo} from './demo/view/datademo';
import {PanelsDemo} from './demo/view/panelsdemo';
import {OverlaysDemo} from './demo/view/overlaysdemo';
import {MenusDemo} from './demo/view/menusdemo';
import {MessagesDemo} from './demo/view/messagesdemo';
import {MiscDemo} from './demo/view/miscdemo';
import {EmptyDemo} from './demo/view/emptydemo';
import {ChartsDemo} from './demo/view/chartsdemo';
import {FileDemo} from './demo/view/filedemo';
import {UtilsDemo} from './demo/view/utilsdemo';
import {Documentation} from './demo/view/documentation';
import {LoginComponent} from './login/login.component';
import {ResetComponent} from './reset/reset.component';
import {UsersComponent} from './users/users.component';
import {TeamsComponent} from './teams/teams.component';
import {TeamComponent} from './team/team.component';
import {LookupComponent} from './lookup/lookup.component';
import {HomeComponent} from './home/home.component';
import {CompanyComponent} from './company/company.component';
import {ProjectsComponent} from './projects/projects.component';
import {CompanyProfileComponent} from './company-profile/company-profile.component';
import {UserService} from './services/user.service';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'reset', component: ResetComponent}, 
    {path: '', component: CompanyProfileComponent, canActivate: [UserService]},
    {path: 'users', component: UsersComponent, canActivate: [UserService]},
    {path: 'projects', component: ProjectsComponent, canActivate: [UserService]},
    {path: 'teams', component: TeamsComponent, canActivate: [UserService]},
    {path: 'team', component: TeamComponent, canActivate: [UserService]},
    {path: 'company', component: CompanyComponent, canActivate: [UserService]},
    {path: 'companyProfile', component: CompanyProfileComponent, canActivate: [UserService]},
    {path: 'lookup', component: LookupComponent, canActivate: [UserService]},
    {path: 'dash', component: DashboardDemo, canActivate: [UserService]}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

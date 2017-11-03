import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import {MenuItem} from 'primeng/primeng';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix">
            <div class="topbar-right">
                <a class="settings-button" style="display: block !important; float: left" href="#" (click)="app.onMenuButtonClick($event)">
                    <i class="material-icons">menu</i>
                </a>
                <img routerLink="/" style="outline: none; cursor: pointer;" width="70px" class="raven-menu-logo" src="../assets/demo/images/logo/raven.svg" />
                <p-menu #menu popup="popup" [model]="settingsOptions" [style]="{'width':'250px'}"></p-menu>
                <a class="settings-button" (click)="menu.toggle($event)">
                    <i class="material-icons">more_vert</i>
                </a>
            </div>
        </div>
    `
})
export class AppTopBar implements OnInit {

    settingsOptions: MenuItem[];
    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.settingsOptions = [{
            label: 'Settings',
            items: [
                {label: 'Users', icon: 'ui-icon-person', routerLink: '/users'},
                // {label: 'Projects', icon: 'ui-icon-assignment', routerLink: '/projects'},
                {label: 'Teams', icon: 'ui-icon-people', routerLink: '/teams'},
                {label: 'Company', icon: 'ui-icon-account-balance', routerLink: '/company'},
                {label: 'Lookup', icon: 'ui-icon-search', routerLink: '/lookup'},
                {label: 'Logout', icon: 'ui-icon-lock', command: (onclick) => {this.app.logout()}}
            ]
        }];
    }
}

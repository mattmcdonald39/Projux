import {Component,AfterViewInit,ElementRef,Renderer,ViewChild, OnInit, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserService } from './services/user.service';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnChanges {

    items: FirebaseListObservable<any[]>;

    user: Observable<firebase.User>;

    email: string;

    password: string;

    errorMessage: string;
    
    layoutCompact: boolean = true;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;
    
    darkMenu: boolean = false;
    
    profileMode: string = 'inline';

    rotateMenuButton: boolean = false;

    topbarMenuActive: boolean = false;;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean = true;

    staticMenuMobileActive: boolean = false;
    
    rightPanelActive: boolean;
    
    rightPanelClick: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean = true;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;
    
    menuHoverActive: boolean;

    // @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

    // @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

    loggedOut: boolean = true;
    currentUser;
    

    constructor(public renderer: Renderer, public router: Router, public db: AngularFireDatabase, private userSvc: UserService) {
        this.userSvc.authChanged().then(user => {
            if (user) {
                this.user = user;
                this.loggedOut = false;
                this.userLoggedIn();
            }
        })
        .catch(err => {
            this.loggedOut = true;
            this.user = null;
        })
    }

    ngAfterViewInit() {
        // this.layoutContainer = <HTMLDivElement> this.layourContainerViewChild.nativeElement;
        // this.layoutMenuScroller = <HTMLDivElement> this.layoutMenuScrollerViewChild.nativeElement;
        
        // setTimeout(() => {
        //     jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
        // }, 10);
        // debugger;
        // if (this.userSvc.userLoggedIn){
        //     this.loggedOut = false;
        // }
    }

    ngOnChanges() {
        // debugger;
        // let test = this.userSvc.userLoggedIn;
    }

    ngOnInit() {
        // if (!this.currentUser) {
        //     this.closeSideMenu();
        //     this.router.navigateByUrl('/login');
        // } else {
        //     this.userLoggedIn();
        // }
        // debugger;
        // if (this.userSvc.userLoggedIn){
        //     this.loggedOut = false;
        // }        
    }

    logout() {
        this.userSvc.logout();
        this.userLoggedOut();
        this.router.navigate(['/login']);
    }

    userLoggedOut() {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.overlayMenuActive = false;
        this.loggedOut = true;

        if(this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = false;
        }
        else {
            if(this.isDesktop())
                this.staticMenuDesktopInactive = true;
            else
                this.staticMenuMobileActive = false;
        }
    }

    userLoggedIn() {
        // this.menuClick = true;
        // this.rotateMenuButton = !this.rotateMenuButton;
        // this.topbarMenuActive = false;
        this.loggedOut = false;

        // if(this.layoutMode === MenuOrientation.OVERLAY) {
        //     this.overlayMenuActive = !this.overlayMenuActive;
        // }
        // else {
        //     if(this.isDesktop())
        //         this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        //     else
        //         this.staticMenuMobileActive = !this.staticMenuMobileActive;
        // }
    }

    onLayoutClick() {
        if(!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if(!this.menuClick) {
            if(this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }
            
            if(this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }
            
            this.menuHoverActive = false;
        }
        
        if(!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if(this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if(this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if(!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;
        
        this.hideOverlayMenu();
        
        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if(this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    closeSideMenu() {

        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.loggedOut = true;

        if(this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if(this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }
    }
        
    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }
    
    onRightPanelClick() {
        this.rightPanelClick = true;
    }
    
    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }
    
    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }
    
    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }

    ngOnDestroy() {
        jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
    }

}
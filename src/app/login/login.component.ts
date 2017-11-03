import { Component, OnInit, AfterViewInit,ElementRef,Renderer,ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  items: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;
  email: string = '';
  password: string = '';
  loginVisible: boolean = true;
  message: string;
  msgs: Message[] = [];
  emailError: boolean = false;
  passwordError: boolean = false;
  emailSent: boolean = false;
  emailSending: boolean = false;

  constructor(db: AngularFireDatabase, public app: AppComponent, private router: Router, private route: ActivatedRoute, private userSvc: UserService) {
}

  ngOnInit(){
    if (this.userSvc.loggedInUser) {
      this.router.navigate(['']);
    }
  }

  login() {
    this.resetErrors();
    this.userSvc.login(this.email, this.password)
      .then(() => {
        this.userSvc.verifyUser();
      }).then(() => {
        this.app.userLoggedIn();
      })
      .catch(error => {
        this.processError(error);
      });
  }

  processError(err){
    switch (err['code']) {
      case 'auth/user-not-found':
        this.message = 'Email not found.';
        this.emailError = true;
        break;
      case 'auth/invalid-email':
        this.message = 'Email address not found. Please try again.';
        this.emailError = true;
        break;
      case 'auth/wrong-password':
        this.message = 'Incorrect password. Please try again.';
        this.passwordError = true;
        break;          
      default:
        console.log(err.message);
        break;
    }
  }

  resetErrors(){
    this.message = '';
    this.emailError = false;
    this.passwordError = false;
    this.emailSent = false;
    this.emailSending = false;
  }

  logout() {
    this.userSvc.logout();
  }

  toggleLoginForgot() {
    this.resetErrors()
    this.loginVisible = !this.loginVisible;
  }

  resetPassword() {
    this.resetErrors();
    this.emailSending = true;
    this.userSvc.resetPassword(this.email)
    .then(() => {
      this.emailSending = false;
      this.emailSent = true;
      this.email = '';
    })
    .catch(error => {
      this.emailSending = false;
      this.processError(error);
    });;
  }
}
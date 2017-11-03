import { Component, OnInit, AfterViewInit,ElementRef,Renderer,ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from 'primeng/primeng';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  password: string = '';
  passwordConfirm: string = '';
  message: string;
  resetError: boolean = false;
  passwordIsValid: boolean = false;


  resetCode: string;
  action: string;

  constructor(private router: Router, private route: ActivatedRoute, private userSvc: UserService) {
  }

  ngOnInit(){
    this.route.queryParams.subscribe((params: Params) => {
      this.resetCode = params['oobCode'];

      this.userSvc.confirmCode(this.resetCode)
      .catch(err => {
        this.resetError = true;
        this.message = err.message;
      })
    })
  }

  passwordValid(){
    if (this.password.length > 0 && this.password === this.passwordConfirm){
      this.passwordIsValid = true;
    } else {
      this.passwordIsValid = false;
    }
  }

  goToSignIn() {
    this.router.navigate(['']);
  }

  resetErrors(){
    this.message = '';
    this.resetError = false;
  }

  resetPassword() {
    this.resetErrors();

    this.userSvc.resetCustomPassword(this.resetCode, this.password)
    .then(() => {
      this.goToSignIn();
    })
    .catch(err => {
      this.resetError = true;
      this.message = err.message;
    });
  }
}
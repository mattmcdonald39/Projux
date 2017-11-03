import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import * as firebase from 'firebase';
import * as functions from 'firebase-functions';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
const firebaseUrl = 'https://us-central1-ux-workflow.cloudfunctions.net';
import { CompanyService } from '../services/company.service';


@Injectable()
export class UserService implements CanActivate {
    userLoggedIn: boolean = false;
    loggedInUser: string;
    authUser: any;

    constructor(private router: Router, private http: Http, private db: AngularFireDatabase, private companySvc: CompanyService) {     
        firebase.auth().onAuthStateChanged(auth => {
            this.verifyUser();
        });
     }

    addUser(user){
        let company;
        let admin = firebase.auth().currentUser;
        return this.companySvc.getCompanyNameByUserUid(admin.uid)
        .then(comp => {
            company = comp;
            return firebase.auth().createUserWithEmailAndPassword(user.email, '1lkjfelk1jfl1ekjflKSASDFJASDF3j##$@#$');
        })
        .then(newUser => {
            user.uid = newUser.uid;    
            user.role = user.role;
            user.title = user.title;
            user.company = company.val();
            return firebase.database().ref(`/users/${user.uid}`).set(user);
        })
        .catch(err => {
            console.log(err.message);
        });
    }

    uploadProfilePic(user, file){
        let storageRef = firebase.storage().ref(`/profilePics/${user.uid}`);
        return storageRef
            .put(file)
            .catch(err => {
                console.log(err)
            });
    }

    saveUser(user) {
        return firebase.database()
            .ref(`/users/${user.uid}`)
            .set(user)
            .catch(err => {
                console.log(err.message);
            });
    }

    getUser(uid) {
        return firebase.database()
        .ref(`/users/${uid}`)
        .once('value')
        .then(snapshot => {
            return snapshot;
        })
    }

    getUsers() {
        // return firebase.database().ref('/users');
        return this.db.list('/users');
    }

    deleteUser(user){
        user.role = 'inactive';
        firebase.database().ref(`/users/${user.uid}`)
            .set(user)
            .catch(err => {
                console.log(err.message);
            });
    }

    authChanged(): Promise<any> {
        return new Promise(function (resolve, reject) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    resolve(user);
                } else {
                    reject(Error('Not Logged In'))
                }
            })
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url: string) {
        let user = firebase.auth().currentUser;
        if (this.userLoggedIn || user) {return true};

        this.router.navigate(['/login']);
        return false;
    }

    register(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    verifyUser() {
        this.authUser = firebase.auth().currentUser;

        if (this.authUser) {
            this.loggedInUser = this.authUser.email;
            this.userLoggedIn = true;
            this.router.navigate(['']);
        }
        return this.authUser;
    }

    login(loginEmail: string, loginPassword: string) {
        let test = firebase.auth().currentUser;
        return firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword);
    }

    logout() {
        this.userLoggedIn = false;
        firebase.auth().signOut().then(function() {
            console.log('Logged Out');
        }, function (error) {
            console.log(error.message);
            return error;
        })
    }

    resetPassword(email: string) {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    confirmCode(code) {
        return firebase.auth().verifyPasswordResetCode(code);
    }

    resetCustomPassword(code, password){
        return firebase.auth().confirmPasswordReset(code, password);
    };

    // updateUser(user) {
    //     return admin.auth().updateUser(user.uid,{
    //         email: user.identifier,
    //         phoneNumber: user.phone,
    //         displayName: `${user.firstName} ${user.lastName}`,
    //         photoURL: user.photo,
    //         disabled: user.disabled
    //     }).then(updatedUser => {
    //         return firebase.database().ref(`/users/${updatedUser.uid}`).set(updatedUser.toJSON());
    //     });
    // }

    // deleteUsers(uid){
    //     return admin.auth().deleteUser(uid)
    //         .then(res => {
    //             firebase.database().ref(`/users/${uid}`).remove();
    //             // should i catch here and undelete the user if there is an error?
    //         });
    // }
}

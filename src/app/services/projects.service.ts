import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CompanyService } from '../services/company.service';
// import {
//     CanActivate,
//     Router,
//     ActivatedRouteSnapshot,
//     RouterStateSnapshot
// } from '@angular/router';
import * as firebase from 'firebase';
import * as functions from 'firebase-functions';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
const firebaseUrl = 'https://us-central1-ux-workflow.cloudfunctions.net';

@Injectable()
export class ProjectsService {
    constructor(private db: AngularFireDatabase, private companySvc: CompanyService) {     
     }

    // uploadTeamIcon(team, file){
    //     let storageRef = firebase.storage().ref(`/teamIcons/${team.name + team.company}`);
    //     return storageRef
    //         .put(file)
    //         .catch(err => {
    //             console.log(err)
    //         });
    // }

    // getTeam(team) {
    //     return firebase.database()
    //     .ref(`/teams/${team}`)
    //     .once('value')
    //     .then(snapshot => {
    //         return snapshot;
    //     })
    // }
    createProject(name) {
        return this.db.database.ref(`/projects/${name}`).set({
            name: name
        });
    }

    getProjectsByCompany(company) {
        return this.db.list(`/companies/${company}/projects`);
    }

    getProjectByName(project) {
        return firebase.database()
        .ref(`/projects/${project}`)
        .once('value')
        .then(snapshot => {
            return snapshot;
        });
    }

    // getAllTeams() {
    //     return this.db.list('/teams');
    // }

    // saveCompany(company) {
    //     return this.db.database
    //         .ref(`/companies/${company.name}`)
    //         .set(company);
    // }

    // delete(team) {
    //     return this.db.database.ref(`/teams/${team.name}`).remove();
    // };

    // saveTeam(team) {
    //     return this.db.database
    //     .ref(`/teams/${team.name}`)
    //     .set(team);
    // }


    // addUser(user){
    //     let company;
    //     let admin = firebase.auth().currentUser;
    //     return this.companySvc.getCompanyNameByUserUid(admin.uid)
    //     .then(comp => {
    //         company = comp;
    //         return firebase.auth().createUserWithEmailAndPassword(user.email, '1lkjfelk1jfl1ekjflKSASDFJASDF3j##$@#$');
    //     })
    //     .then(newUser => {
    //         user.uid = newUser.uid;    
    //         user.role = user.role;
    //         user.title = user.title;
    //         user.company = company.val();
    //         return firebase.database().ref(`/users/${user.uid}`).set(user);
    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //     });
    // }

    // addTeam(team){
    //     let admin = firebase.auth().currentUser;
    //     let ref = this.db.database.ref(`/teams`);

    //     return this.companySvc.getCompanyNameByUserUid(admin.uid)
    //     .then((comp) => {
    //         team.company = comp.val();
    //         console.log(team);
    //         return ref.child(team.name).once('value', snapshot => {
    //             if (snapshot.val() !== null) {
    //                 return;
    //                 // let promise = new firebase.Promise(res, rej => {});
    //                 // return new Promise((resolve, reject) => {
    //                 //     reject('Company already exists');
    //                 // });
    //             } else {
    //                 return this.db.database
    //                 .ref(`/teams/${team.name}`)
    //                 .set(team)
    //                 .catch(err => {
    //                     console.log(err.message);
    //                 });
    //             }
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //     });
    // }

}



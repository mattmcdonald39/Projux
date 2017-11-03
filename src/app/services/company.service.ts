import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
export class CompanyService {
    constructor(private db: AngularFireDatabase) {     
     }

    uploadCompanyLogo(company, file){
        let storageRef = firebase.storage().ref(`/companyLogos/${company}`);
        return storageRef
            .put(file)
            .catch(err => {
                console.log(err)
            });
    }

    getCompanies() {
        return this.db.list('/companies');
    }

    getAllCompaniesSnapshot() {
        return this.db.database
            .ref(`/companies`)
            .once('value');
    }

    saveCompany(company) {
        return this.db.database
            .ref(`/companies/${company.name}`)
            .set(company);
    }

    delete(company) {
        return this.db.database.ref(`/companies/${company.name}`).remove();
    };
    
    getCompanyNameByUserUid(uid) {
        let ref = this.db.database.ref(`/users/${uid}/company`);
        return ref.once('value', snapshot => {
            const companyName = snapshot.val();
            return companyName;
        })
    }

    addCompany(company){
        let ref = this.db.database.ref(`/companies`);
        return ref.child(company.name).once('value', snapshot => {
            if (snapshot.val() !== null) {
                return;
                // let promise = new firebase.Promise(res, rej => {});
                // return new Promise((resolve, reject) => {
                //     reject('Company already exists');
                // });
            } else {
                return this.db.database
                .ref(`/companies/${company.name}`)
                .set(company)
                .catch(err => {
                    console.log(err.message);
                });
            }
        })
        .catch(err => {
            console.log(err.message);
        })
    }

}



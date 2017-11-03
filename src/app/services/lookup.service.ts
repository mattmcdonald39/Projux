import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Lookup } from '../models/lookup';

@Injectable()
export class LookupService {

  constructor(private db: AngularFireDatabase) { }

  getLookup(name){
    // return firebase.database().ref(`/lookups/${name}/fields`);
    return this.db.list(`/lookups/${name}/fields`);
  }

  getAllLookups(){
    return this.db.list('/lookups');
  }

}
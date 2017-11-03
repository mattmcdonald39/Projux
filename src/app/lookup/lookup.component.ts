import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Lookup } from '../models/lookup';
import { LookupService } from '../services/lookup.service';
import { ProjectCardComponent, CardItem} from '../project-card/project-card.component';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  lookups: CardItem[];
  addMode: boolean = false;
  editMode: boolean = false;
  promptDelete: boolean = false;
  addPrompt: boolean = false;
  newName: string = '';
  newLookup: Lookup = new Lookup();
  editLookup: Lookup = new Lookup();
  allLookups: Lookup[];
  lookupFields: CardItem[];

  constructor(private db: AngularFireDatabase, private lookupSvc: LookupService) {
   }

  ngOnInit() {
    this.lookupSvc.getAllLookups()
    .subscribe(lookups => {
      this.allLookups = lookups;
      this.lookups = lookups.map(l => {
        let item = new CardItem();
        item.value = l.name;
        item.label = l.name;
        return item;
      });
    });
    // this.lookups = this.db.list('/lookups');
  }

  // lookupFields(lookup) {
  //   if (lookup){
  //     return lookup.fields.map(lf => {
  //       let item = new CardItem();
  //       item.value = lf.$value;
  //       item.label = lf.$value;
  //       return item;
  //     });
  //   } else {
  //     return null;
  //   }
  // }

  edit(lookup) {
    this.editLookup = this.allLookups.find(f => f.name === lookup);
    this.lookupFields = this.editLookup.fields.map(lf => {
      let item = new CardItem();
      item.value = lf;
      item.label = lf;
      return item;
    });
    this.editMode = true;
  }

  saveLookup(lookup: Lookup) {
    lookup.fields = [];
    this.lookupFields.forEach(field => {
      lookup.fields.push(field.value);
    });
    this.db.database
      .ref(`/lookups/${lookup.name}`)
      .set(lookup)
      .then(() => {
        this.cancel();
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  hasEmptyValues(lookup: Lookup){
    if(lookup.fields.includes('') || lookup.name === ''){
      return true;
    } else {
      return false;
    }
  }

  addModeTrigger() {
    this.lookupFields = [];
    let item = new CardItem();
    item.value = '';
    item.label = '';
    this.newLookup = new Lookup();
    this.newLookup.name = this.newName;
    this.addPrompt = false;
    this.addMode = true;
  }

  deleteLookup(lookup: Lookup) {
    this.db.database
      .ref(`/lookups/${lookup.name}`)
      .remove()
      .then(() => {
        this.promptDelete = false;
        this.cancel();
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  removeField(field, source: Lookup) {
    source.fields.splice(source.fields.indexOf(field), 1);
  }

  trackByIndex(index: number, obj: any) {
    return index;
  }

  cancel(){
    this.addMode = false;
    this.editMode = false;
    this.newLookup = new Lookup();
    this.editLookup = new Lookup();
  }
}

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UserService } from '../services/user.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { LookupService } from '../services/lookup.service';
import { ProjectCardComponent, CardItem } from '../project-card/project-card.component';
import { CustomEditCardComponent } from '../custom-edit-card/custom-edit-card.component';


class User {
  firstName: string = '';
  lastName: string = '';
  title: string = '';
  role: string = '';
  email: string = '';
  lastModified: Date;
  phone: string = '';
  photoUrl: string;
  uid: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  newUserMode: boolean = false;
  editMode: boolean = false;
  deletePrompt: boolean = false;
  editedUser: User;
  idToDelete: string;
  newUser: User;
  list: CardItem[];
  accessRoles: any[] = [];
  accessRolesFilters: any[];
  roleFilter: string = 'all';
  uploadedFiles: any[] = [];
  percentageComplete;
  titles: any[] = [];

  constructor(private userSvc: UserService, private db: AngularFireDatabase, private router: Router, private lookupSvc: LookupService) { 
    this.newUser = new User();
    this.editedUser = new User();
    // this.accessRoles.push({label:'All', value:'all'});
    // this.accessRoles.push({label:'User', value:'user'});
    // this.accessRoles.push({label:'Admin', value:'admin'});
    // this.accessRoles.push({label:'Inactive', value:'inactive'});
    // this.accessRolesFilters = this.accessRoles.slice();
    // this.accessRoles.shift();
  }

  ngOnInit() {
    this.accessRoles.push({label:'All', value:'all'});
    this.lookupSvc.getLookup('Roles').subscribe(roles => {
      roles.forEach(role => {
        this.accessRoles.push({label: role.$value, value: role.$value.toLowerCase()});
      })
      this.accessRolesFilters = this.accessRoles.slice();
      this.accessRoles.shift();   
    })

    this.lookupSvc.getLookup('Titles').subscribe(event => {
      this.titles = event.map(m => {
        return {
          label: m.$value,
          value: m.$value
        }
      })
    });

    this.newUser.title = this.titles[0];
    this.newUser.role = this.accessRoles[0];
    this.editedUser.title = this.titles[0];
    this.editedUser.role = this.accessRoles[0];

    this.userSvc.getUsers().subscribe(users => {
      this.users = users;
      this.list = users.map(u => {
        let item = new CardItem();
        item.value = u.uid;
        item.label = u.firstName + ' ' + u.lastName;
        return item;
      });
    });
  }

  ngOnDestroy() {

  }

  deleteProfilePic() {
    if (this.editMode) {
      this.editedUser.photoUrl = null;
    }
    if (this.newUserMode) {
      this.newUser.photoUrl = null;
    }
    this.uploadedFiles = [];
  }

  onUpload(event, userType) {
    this.userSvc.uploadProfilePic(userType === 'new' ? this.newUser : this.editedUser, event.files[0])
    .then(ref => {
      if (userType === 'new') {
        this.newUser.photoUrl = ref.downloadURL;
      } else {
        this.editedUser.photoUrl = ref.downloadURL;
      }
    });
  }

  addUser() {
    this.userSvc
      .addUser(this.newUser)
      .then(() => {
        this.newUserMode = false
        this.newUser = new User();
        // this.router.navigate(['/users']);
      });
  }

  saveUser() {
    this.userSvc.saveUser(this.editedUser)
    .then(() => {
      this.editMode = false;
    });
  }

  editUser(uid){
    this.editMode = true;
    this.editedUser = this.users.find(u => u.uid === uid);
  }

}
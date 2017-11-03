import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { ProjectCardComponent, CardItem} from '../project-card/project-card.component';
import { CustomEditCardComponent } from '../custom-edit-card/custom-edit-card.component';

class Company {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: number;
  email: string;
  website: string;
  logo: string;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  newCompanyMode: boolean = false;
  newCompany: Company;
  editedCompany: Company;
  editMode: boolean = false;
  promptDelete: boolean = false;
  companies: CardItem[];
  allCompanies: Company[];

  constructor(private companySvc: CompanyService) { }

  ngOnInit() {
    // this.newCompany = new Company();
    this.newCompany = new Company();
    // this.newCompany.name = 'Super Number 1';
    // this.newCompany.address = '123 main st';
    // this.newCompany.city = 'chandler';
    // this.newCompany.state = 'az';
    // this.newCompany.phone = 4807210183;
    // this.newCompany.email = 'super@num1.com';
    // this.newCompany.website = 'www.supernumber1.com';
    // this.newCompany.logo = '';
    
    this.editedCompany = new Company();
    this.companySvc.getCompanies()
    .subscribe(companies => {
      this.allCompanies = companies;
      this.companies = companies.map(c => {
        let item = new CardItem();
        item.label = c.name;
        item.value = c.name;
        return item;
      })
    });
  }
  
  deleteCompany(company: Company) {
    this.companySvc.delete(company)
    .then(() => {
      this.promptDelete = false;
      this.editMode = false;
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  toggleNewCompanyMode() {
    this.newCompanyMode = !this.newCompanyMode;
  }

  editCompany(company){
    this.editMode = true;
    this.editedCompany = this.allCompanies.find(c => c.name === company);
  }

  saveCompany() {
    this.companySvc.saveCompany(this.editedCompany)
    .then(() => {
      this.editedCompany = new Company();
      this.editMode = false;
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  addCompany() {
    this.companySvc.addCompany(this.newCompany)
    .then(() => {
      this.newCompanyMode = false;
      this.newCompany = new Company();
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  onUpload(event, userType) {
    this.companySvc.uploadCompanyLogo(userType === 'new' ? this.newCompany.name : this.editedCompany.name, event.files[0])
    .then(ref => {
      if (userType === 'new') {
        this.newCompany.logo = ref.downloadURL;
      } else {
        this.editedCompany.logo = ref.downloadURL;
      }
    });
  }
}

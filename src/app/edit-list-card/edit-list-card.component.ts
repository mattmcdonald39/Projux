import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardItem } from '../models/cardItem';

@Component({
  selector: 'edit-list-card',
  templateUrl: './edit-list-card.component.html',
  styleUrls: ['./edit-list-card.component.css']
})
export class EditListCardComponent implements OnInit {
  @Output() delete = new EventEmitter();
  @Output() itemClicked = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();
  @Input() list: CardItem[];
  @Input() showButton: boolean = true;
  @Input() name: string = 'please input name';
  promptDelete: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  deletePressed() {
    this.delete.emit(this.name);
  }

  savePressed() {
    this.save.emit(this.list);
  }

  addToList() {
    let newItem = new CardItem();
    newItem.label = '';
    newItem.value = '';
    this.list.push(newItem);
  }

  select(item) {
    this.itemClicked.emit(item);
  }

  cancelPressed() {
    this.cancel.emit();
  }

  hasEmptyValues(){
    if (this.list.findIndex(l => l.value === '') > -1){ 
      return true;
    } else {
      return false;
    }
  }
}

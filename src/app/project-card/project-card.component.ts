import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class CardItem {
  label: string;
  value: any;
}

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Output() add = new EventEmitter();
  @Output() itemClicked = new EventEmitter();
  @Input() list: CardItem[];
  @Input() name: string = 'please input name';

  constructor() { }

  ngOnInit() {
  }

  addNew() {
    this.add.emit();
  }

  select(item) {
    this.itemClicked.emit(item);
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ContentChild } from '@angular/core';

@Component({
  selector: 'custom-edit-card',
  templateUrl: './custom-edit-card.component.html',
  styleUrls: ['./custom-edit-card.component.css']
})
export class CustomEditCardComponent implements OnInit {
  @Input() name: string;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitSave(){
    this.save.emit();
  }

  emitCancel(){
    this.cancel.emit();
  }
}

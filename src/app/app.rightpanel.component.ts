import {Component,OnInit,ViewChild,ElementRef} from '@angular/core';
import {AppComponent} from './app.component';
declare var jQuery: any;

@Component({
    selector: 'app-rightpanel',
    template: `
        <div class="layout-rightpanel" [ngClass]="{'layout-rightpanel-active': app.rightPanelActive}" (click)="app.onRightPanelClick()">
            <div #rightPanelMenuScroller class="nano">
                <div class="nano-content right-panel-scroll-content" style="margin-top: 15px">
                    <span style="padding: 25px; display: block;">Right Menu</span>
                </div>
            </div>
            
        </div>
    `
})
export class AppRightPanel {

    rightPanelMenuScroller: HTMLDivElement;
    
    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(public app: AppComponent) {}
    
    ngAfterViewInit() {
        this.rightPanelMenuScroller = <HTMLDivElement> this.rightPanelMenuScrollerViewChild.nativeElement;
        
        setTimeout(() => {
            jQuery(this.rightPanelMenuScroller).nanoScroller({flash:true});
        }, 10);
    }
    
    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({flash:true});
    }
}
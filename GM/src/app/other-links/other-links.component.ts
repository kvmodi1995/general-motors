import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'general-motor-other-links',
	templateUrl: './other-links.component.html',
	styleUrls: ['./other-links.component.scss']
})
export class OtherLinksComponent implements OnInit {

	@Output() viewChanged = new EventEmitter<any>();
	@Output() invoicePrintClicked = new EventEmitter<any>();
	@Output() showIncentivesClicked = new EventEmitter<any>();
	public selectedView = 'customer';

	constructor() { }

	ngOnInit() { }

	printInvoice(event) {
		this.invoicePrintClicked.emit(event);
	}

	showIncentives(event) {
		this.showIncentivesClicked.emit(event);
	}

	viewChange(event) {
		this.viewChanged.emit(event);
	}
}

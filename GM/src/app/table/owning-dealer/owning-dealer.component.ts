import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'general-motor-owning-dealer',
	templateUrl: './owning-dealer.component.html',
	styleUrls: ['./owning-dealer.component.scss']
})
export class OwningDealerComponent implements OnInit {

	@Input() data: any;
	@Input() vinDetail: boolean;

	constructor() { }

	ngOnInit() {
	}

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'general-motor-search-criteria',
	templateUrl: './search-criteria.component.html',
	styleUrls: ['./search-criteria.component.scss']
})
export class SearchCriteriaComponent implements OnInit {

	@Output() editSearchClicked = new EventEmitter<any>();
	@Input() searchCriteria: any;
	@Input() searchCriteriaName: any;
	@Input() division: any;
	@Input() selectedSearch: any;

	constructor() { }

	ngOnInit() { }

	editSearch() {
		this.editSearchClicked.emit();
	}
}

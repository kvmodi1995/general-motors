import { Component, Input, OnChanges, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
	selector: 'general-motor-vehicle-options',
	templateUrl: './vehicle-options.component.html',
	styleUrls: ['./vehicle-options.component.scss']
})
export class VehicleOptionsComponent implements OnInit, OnChanges {

	@Input() options: any;
	@Input() view: any;
	public data: any;

	constructor() { }

	ngOnInit() {
		this.separateOptions(this.options);
	}

	ngOnChanges(changes) {
		if (changes.options && changes.options.currentValue) {
			this.separateOptions(changes.options.currentValue);
		}
	}

	separateOptions(options) {
		const that = this;
		this.data = _.groupBy(options, 'OptionType');
		_.each(this.data['Chargable Options'], (option, index) => {
			that.data['Chargable Options'][index].MSRP = _.find(option.Price, {Type: 'MSRP'});
			that.data['Chargable Options'][index].invoice = _.find(option.Price, {Type: 'Invoice'});
		});
	}
}

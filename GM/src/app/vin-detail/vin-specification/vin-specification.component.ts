import {Component, Input, OnChanges, OnInit} from '@angular/core';
import * as _ from 'lodash';

export declare interface OptionObject {
	FamilyCode: string;
	OptionCode: string;
	OptionDescription: string;
	OptionType: string;
}

export declare interface PriceObject {
	Value: number;
	Type: string;
	CurrencyID: string;
}

@Component({
	selector: 'general-motor-vin-specification',
	templateUrl: './vin-specification.component.html',
	styleUrls: ['./vin-specification.component.scss']
})
export class VinSpecificationComponent implements OnInit, OnChanges {

	@Input() view: any;
	@Input() data: any;
	public PEG: OptionObject;
	public primaryColor: OptionObject;
	public trim: OptionObject;
	public transmission: OptionObject;
	public engine: OptionObject;
	public MSRP: PriceObject;
	public employeePrice: PriceObject;
	public supplierPrice: PriceObject;
	public invoice310: PriceObject;

	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges(changes) {
		if (changes.data && changes.data.currentValue) {
			this.PEG = _.find(this.data.Option, {FamilyCode: 'SPP'});
			this.primaryColor = _.find(this.data.Option, {FamilyCode: 'CCU'});
			this.trim = _.find(this.data.Option, {FamilyCode: 'ITC'});
			this.transmission = _.find(this.data.Option, {FamilyCode: 'TRN'});
			this.engine = _.find(this.data.Option, {FamilyCode: 'ENG'});
			this.MSRP = _.find(this.data.Price, {Type: 'MSRP'});
			this.employeePrice = _.find(this.data.Price, {Type: 'employeePrice'});
			this.supplierPrice = _.find(this.data.Price, {Type: 'supplierPrice'});
			this.invoice310 = _.find(this.data.Price, {Type: 'invoice310'});
		}
	}

}

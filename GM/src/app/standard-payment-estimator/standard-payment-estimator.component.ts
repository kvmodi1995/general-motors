import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';

export declare interface PriceObject {
	Value: any;
	Type: string;
	CurrencyID: string;
}

@Component({
	selector: 'general-motor-standard-payment-estimator',
	templateUrl: './standard-payment-estimator.component.html',
	styleUrls: ['./standard-payment-estimator.component.scss']
})
export class StandardPaymentEstimatorComponent implements OnInit, OnChanges {

	@Input() data: PriceObject[];
	public form: FormGroup;
	public payment: number;

	constructor() { }

	ngOnInit() {
		this.form = new FormGroup({
			finalPrice: new FormControl(null, Validators.required),
			term: new FormControl(null, Validators.compose([Validators.required, Validators.min(1), Validators.max(120)])),
			APR: new FormControl(null, Validators.compose([Validators.required, Validators.min(0), Validators.max(20)])),
			cashDown: new FormControl(null)
		});
	}

	ngOnChanges(changes) {
		if (changes.data.currentValue) {
			const price = _.find(this.data, {Type: 'MSRP'});
			price.Value = parseFloat(price.Value);
			this.form.controls.finalPrice.setValue(price.Value);
			this.form.controls['cashDown'].validator = Validators.max(price.Value);
		}
	}

	calculatePayment(options) {
		if (options.valid) {
			const {finalPrice, term, APR} = options.value;
			const cashDown = options.value.cashDown || 0;
			this.payment = ((APR / 1200) * (finalPrice - cashDown)) / (1 - Math.pow((1 + APR / 1200), (-1 * term)));
		}
	}
}

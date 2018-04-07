import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as _ from 'lodash';

import { res } from '../api-response/response';

@Component({
	selector: 'general-motor-dealer-detail',
	templateUrl: './dealer-detail.component.html',
	styleUrls: ['./dealer-detail.component.scss']
})
export class DealerDetailComponent implements OnInit {

	public bac: any;
	public tradeContact: any;
	public dealer: any;
	public loading: boolean;

	constructor(private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.bac = params.bac;
			this.loading = true;
			this.dealer = {
				'SellingSourceCode': '13',
				'VendorId': '114404',
				'DealerCode': '19464',
				'Type': 'dealer',
				'Name': 'WENTWORTH CHEVROLET CO.'
			};
			this.tradeContact = res.tradeContactInfo.response;
			_.each(this.tradeContact, (contact) => {
				contact.id = contact.contactType === 'P' ? 'Primary' : (contact.contactType === 'S' ? 'Secondary' : '');
			});
			this.loading = false;
		});
	}

}

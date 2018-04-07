import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';

import * as _ from 'lodash';

import {VSSService} from '../../services/vss.services';

@Component({
	selector: 'general-motor-search-by-location',
	templateUrl: './search-by-location.component.html',
	styleUrls: ['./search-by-location.component.scss']
})
export class SearchByLocationComponent implements OnInit {

	@Input() modal: any;
	public divisions = ['All', 'GMC', 'Buick', 'Cadillac', 'Chevrolet'];
	public selectedDivision = 'All';
	public states: Array<any>;
	public searchResult = [];
	public searchCriteria: any;
	public result = false;
	public showQuickLinks: boolean;
	public options: FormGroup;
	public loading = false;


	constructor(
		private fb: FormBuilder,
		private router: Router,
		private titleService: Title,
		private vssService: VSSService
	) { }

	ngOnInit() {
		this.titleService.setTitle('Locate Dealer');
		this.router.events.subscribe(event => {
			if (event instanceof ActivationEnd) {
				this.showQuickLinks = event.snapshot.url[0].path.includes('popup');
			}
		});
		this.options = this.fb.group({
			selectedSearch: 'Dealer Name',
			'Dealer Name': this.fb.group({
				name: new FormControl(''),
				state: new FormControl('', Validators.required)
			}),
			'Zip Code': this.fb.group({
				code: new FormControl({value: '', disabled: true}),
				radius: new FormControl({value: '', disabled: true})
			}),
			'City': this.fb.group({
				city: new FormControl({value: '', disabled: true}),
				state: new FormControl({value: '', disabled: true}),
				radius: new FormControl({value: '', disabled: true})
			}),
			BAC: this.fb.group({
				number: new FormControl({value: '', disabled: true})
			})
		});
		// get All states
		this.vssService.getStates().subscribe(response => {
			this.states = response;
		});
	}

	changeRadio() {
		let searchOption = '';

		_.each(this.options.controls, (control: any, index) => {
			if (index === 'selectedSearch') {
				searchOption = control.value;
			} else {
				if (index !== searchOption) {
					_.forEach(control.controls, (value) => {
						value.validator = null;
						value.disable();
					});
				} else {
					_.forEach(control.controls, (value, field) => {
						if (field === 'city' || field === 'state' || field === 'radius') {
							value.validator = Validators.required;
						}
						if (field === 'number') {
							value.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
						}
						if (field === 'code') {
							value.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
						}
						value.enable();
					});
				}
			}
		});
	}

	checkNumber(event, field) {
		const pattern = /[0-9]/;
		const inputChar = String.fromCharCode(event.charCode);

		if (event.charCode !== 0 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	editSearch() {
		this.result = false;
	}

	showDealerDetail(selectedSearch) {
		if (selectedSearch.valid) {
			this.loading = true;
			this.searchCriteria = selectedSearch.value;
			this.searchResult = [];
			this.result = true;
			this.loading = false;
		}
	}
}

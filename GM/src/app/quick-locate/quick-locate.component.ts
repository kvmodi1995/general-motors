import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { VLSService } from '../services/vls.services';
import { environment } from '../../environments/environment';


@Component({
	selector: 'general-motor-quick-locate',
	templateUrl: './quick-locate.component.html',
	styleUrls: ['./quick-locate.component.scss']
})
export class QuickLocateComponent implements OnInit, OnChanges {

	@Input() clearData: boolean;

	@Output() quickLocateError = new EventEmitter<any>();
	public displayError: string;
	public number: string;
	public quickForm: FormGroup;
	public seasons = [
		'VIN',
		'Stock #',
		'Order #',
	];

	constructor(private vlsService: VLSService) { }

	ngOnInit() {
		this.quickForm = new FormGroup({
			searchBy: new FormControl('VIN', Validators.required),
			value: new FormControl('', Validators.required)
		});
	}

	ngOnChanges(changes) {
		if (changes.clearData.currentValue) {
			this.quickForm.controls['searchBy'].setValue('VIN');
			this.quickForm.controls['value'].setValue('');
			this.quickForm.controls['value'].markAsUntouched();
		}
	}

	checkNumber(event) {
		if (event.key !== undefined && event.key !== undefined && !(event.ctrlKey && event.key === 'v')) {
			const pattern = /[a-zA-Z0-9]/;
			const inputChar = String.fromCharCode(event.charCode);

			if (event.charCode !== 0 && !pattern.test(inputChar)) {
				event.preventDefault();
			}
		}
	}

	getQuickLocateData(form) {
		if (form.valid) {
			const {searchBy, value} = form.value;
			switch (searchBy) {
				case 'Stock #': {
					break;
				}
				case 'Order #': {
					break;
				}
				default: {
					const criteria = this.vlsService.locateVehicleByVin(value);
					this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
						if (response.ShowVehicleInventory.SearchByVIN &&
							response.ShowVehicleInventory.SearchByVIN[0].VinNumber === value &&
							response.ShowVehicleInventory.Status.Code === '30000') {
							window.open(`${environment.baseURL}/${environment.vinDetail}?vin=${value}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
						} else {
							this.displayError = response.ShowVehicleInventory.Status.Message;
						}
					});
					break;
				}
			}
		}
	}

	onOptionChange(event) {
		this.clearData = false;
		this.quickForm.controls.value.reset();
	}

}

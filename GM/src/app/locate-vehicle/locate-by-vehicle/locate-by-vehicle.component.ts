import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';

import { VSSService } from '../../services/vss.services';
import { VLSService } from '../../services/vls.services';
import { AlertComponent } from '../../modal/alert/alert.component';
import { SearchBacComponent } from '../../modal/search-bac/search-bac.component';

@Component({
	selector: 'general-motor-locate-by-vehicle',
	templateUrl: './locate-by-vehicle.component.html',
	styleUrls: ['./locate-by-vehicle.component.scss']
})
export class LocateByVehicleComponent implements AfterViewChecked, OnInit {

	@ViewChild('searchVehicleForm') searchVehicleForm;

	public searchVehicle: FormGroup;
	public years = [];
	public makes = [];
	public models = [];
	public bodyStyles: object;
	public allSelected = false;
	public checkedValue = [];
	public selectedBodyStyle = [];
	public maxMSRP = 0;
	public eventCode: any;
	public maxRecord = 10;
	public result = false;
	public searchedData: any;
	public additionalData: any;
	public recordPerPageArray = [10, 20, 30, 40, 50];
	public earliestEventCode = [{
		code: 3000,
		value: 'Order accepted by Production Control'
	}, {
		code: 3800,
		value: 'Produced'
	}, {
		code: 5000,
		value: 'Delivered to Dealer'
	}];
	public selectedYear: any;
	public selectedMake: any;
	public selectedModel: any;
	public clearData: boolean;
	public displayError: string;
	public selectedSearchOptions: Array<any>;
	public sourceStates = [];
	public targetStates = [];
	public states: Array<any>;
	public errorMessage = [];
	public searchCriteria: any;
	public selectBodyError: boolean;
	public selectStateError: boolean;
	public selectedSearch: any;
	public showSelectionOption = false;
	public modelOptionGroups: any;
	public vehicleSearchType = [{
		value: 'Include CTP Vehicles',
		option: 'IncludeCTPVehicles',
		checked: false
	}, {
		value: 'Include Sold/Fleet Vehicles whose age is > 30 days outside My Inventory',
		option: 'IncludeSoldFleetVehicles',
		checked: false
	}, {
		value: 'Include Demo Vehicles',
		option: 'IncludeDemoVehicles',
		checked: false
	}, {
		value: 'Display Option Level Pricing',
		option: 'IncludeOptionLevelPricing',
		checked: false
	}, {
		value: 'Display Total Cash Allowance',
		option: 'IncludeTotalCashAllowance',
		checked: false
	}];
	public loading = false;
	public options: any;
	public vendorId: string;
	public invalidExcludeBAC: boolean;

	constructor(
		public dialog: MatDialog,
		private fb: FormBuilder,
		private titleService: Title,
		private vssService: VSSService,
		private vlsService: VLSService
	) { }

	ngOnInit() {
		this.searchVehicle = this.fb.group({
			yearMakeModel: this.fb.group({
				year: new FormControl('', Validators.required),
				make: new FormControl('', Validators.required),
				model: new FormControl('', Validators.required),
			}),
			excludeBAC: this.fb.group({
				value: new FormControl(null),
				bacs: new FormArray([
					new FormControl({value: '', disabled: true}),
					new FormControl({value: '', disabled: true}),
					new FormControl({value: '', disabled: true}),
					new FormControl({value: '', disabled: true}),
					new FormControl({value: '', disabled: true}),
				])
			}),
			selectedOption: this.fb.group({
				value: new FormControl('Zip Code'),
				'Zip Code': this.fb.group({
					code: new FormControl(97214, Validators.required),
					radius: new FormControl(50, Validators.required)
				}),
				City: this.fb.group({
					city: new FormControl({value: '', disabled: true}),
					state: new FormControl({value: '', disabled: true}),
					radius: new FormControl({value: '', disabled: true})
				}),
				bacRadius: new FormControl({value: '', disabled: true}),
				BAC: this.fb.group({
					number: new FormArray([
						new FormControl({value: '', disabled: true}),
						new FormControl({value: '', disabled: true}),
						new FormControl({value: '', disabled: true}),
						new FormControl({value: '', disabled: true}),
						new FormControl({value: '', disabled: true}),
					])
				})
			})
		});
		this.targetStates = [];
		// call getSates API
		this.vssService.getStates().subscribe(response => {
			this.states = response;
			this.sourceStates = _.sortBy(response, 'name');
		});
		// call GetAllYears api
		this.vssService.getAllYears().subscribe(response => {
			this.years = response;
			this.selectedYear = this.years[this.years.length - 2].Year;
			this.getMakes(this.selectedYear);
		});

		this.eventCode = _.find(this.earliestEventCode, {code: 5000});
		if (!this.selectedMake) {
			this.searchVehicle.controls.yearMakeModel['controls'].model.disable();
		}

		this.vlsService.getVendorID().subscribe(response => {
			this.vendorId = response.bac;
		});
	}

	ngAfterViewChecked() {
		this.hideListButtons();
	}

	bodyStyleSelected(event, index) {
		if (event.checked) {
			this.selectedBodyStyle.push(event.source.value);
		} else {
			this.selectedBodyStyle.splice(this.selectedBodyStyle.indexOf(event.source.value), 1);
		}
		this.getOptionList(this.selectedBodyStyle);
		this.checkedValue[index] = event.checked;
	}

	changeRadio(event) {
		_.each(this.searchVehicle.controls['selectedOption']['controls'], (control: any, index) => {
			if (event.value) {
				if (event.value === index) {
					if (index === 'bacRadius') {
						control.setValidators([Validators.required]);
						control.enable();
					} else {
						_.forEach(control.controls, (value, field) => {
							if (field === 'number') {
								_.each(value.controls, function (number, numberIndex) {
									if (!numberIndex) {
										number.validator = Validators.required;
									}
									number.enable();
								});
							} else {
								value.validator = Validators.required;
							}
							value.enable();
						});
					}
				} else {
					if (index === 'bacRadius') {
						control.clearValidators();
						control.markAsUntouched();
						control.disable();
					} else {
						_.forEach(control.controls, (value) => {
							value.clearValidators();
							control.markAsUntouched();
							value.disable();
						});
					}
				}
			}
		});
	}

	checkNumber(event) {
		this.invalidExcludeBAC = false;
		if (event.key !== undefined && event.key !== undefined && !(event.ctrlKey && event.key === 'v')) {
			const pattern = /[0-9]/;
			const inputChar = String.fromCharCode(event.charCode);

			if (event.charCode !== 0 && !pattern.test(inputChar)) {
				event.preventDefault();
			}
		}
	}

	checkValue(event) {
		const selectedOption = this.searchVehicle.controls.selectedOption.value.value;
		this.invalidExcludeBAC = false;
		if (selectedOption === 'BAC' || selectedOption === 'My Trading Partner') {
			this.searchVehicle.controls.excludeBAC.value.value = false;
			event.source.checked = false;
			const dialogRef = this.dialog.open(AlertComponent, {
				data: {field: `Search By ${selectedOption}`}
			});
		} else {
			_.each(this.searchVehicle.controls.excludeBAC['controls'].bacs.controls, function (value, field) {
				const validation = [Validators.minLength(6), Validators.maxLength(6)];
				if (event.source.checked) {
					value.setValidators(validation);
					value.enable();
				} else {
					value.disable();
				}
			});
		}
	}

	displayQuickLocateError(event) {
		this.displayError = event.error;
	}

	editSearchCriteria() {
		this.result = false;
		this.titleService.setTitle('Locate Vehicle');
		this.errorMessage = [];
		this.hideListButtons();
	}

	excludeVendor(criteria) {
		const excludeVendorId = [];
		_.each(this.searchVehicle.controls.excludeBAC['controls'].bacs.controls, function (number) {
			if (number.value !== '') {
				excludeVendorId.push(_.parseInt(number.value));
			}
		});
		criteria['FilterCriteria'] = {
			ExcludedVendorId: {
				VendorId: excludeVendorId
			}
		};
		return criteria;
	}

	getData(event, formData) {
		this.selectBodyError = !this.selectedBodyStyle.length;
		this.selectStateError = this.searchVehicle.controls.selectedOption.value.value === 'state' && !this.targetStates.length;
		this.invalidExcludeBAC = this.searchVehicle.value.excludeBAC.value && this.validateExcludeBAC();
		if (formData.valid && !this.selectBodyError && !this.selectStateError && !this.invalidExcludeBAC) {
			this.loading = true;
			event.preventDefault();
			const dataPromise = [];
			this.selectedSearchOptions = _.filter(this.vehicleSearchType, function (search) {
				return search.checked;
			});
			this.selectedSearchOptions.unshift({value: 'My Inventory'});
			const {year, make, model} = formData.value.yearMakeModel;
			if (formData.value.selectedOption.value === 'state') {
				formData.value.selectedOption[formData.value.selectedOption.value] = this.targetStates;
			}
			this.searchCriteria = {
				year: year,
				make: make,
				model: model,
				bodyStyle: this.selectedBodyStyle,
				searchedCriteria: this.selectedSearchOptions,
				earliestEventCode: this.eventCode,
				maxMSRP: this.maxMSRP,
				additionalCriteria: formData.value,
				options: this.options,
				vendorId: this.vendorId,
			};
			const modelCode = this.selectedBodyStyle[0].modelId;
			this.selectedSearch = this.searchVehicle.value.selectedOption[this.searchVehicle.value.selectedOption.value];
			let criteria = {};
			criteria = this.vlsService.locateVehiclesBySingleVendor(make.MakeID, this.maxRecord, modelCode, make.SellingSourceID, this.vendorId, year);
			criteria = this.modifyCriteria(criteria);
			dataPromise.push(new Promise((resolve, reject) => {
				this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
					resolve(response);
				});
			}));
			this.searchedData = [];
			switch (this.searchVehicle.value.selectedOption.value) {
				case 'City': {
					const {city, state, radius} = formData.value.selectedOption[formData.value.selectedOption.value];
					criteria = this.vlsService.locateVehiclesByCity(city, make.MakeID, this.maxRecord, modelCode, radius, make.SellingSourceID, state.abbr, year);
					criteria = this.modifyCriteria(criteria);
					if (this.searchVehicle.controls.excludeBAC['controls'].value.value) {
						criteria = this.excludeVendor(criteria);
					}
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByCity;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
				case 'Zip Code': {
					const {code, radius} = formData.value.selectedOption[formData.value.selectedOption.value];
					criteria = this.vlsService.locateVehiclesByPostalCode(make.MakeID, this.maxRecord, modelCode, code, radius, make.SellingSourceID, year);
					criteria = this.modifyCriteria(criteria);
					if (this.searchVehicle.controls.excludeBAC['controls'].value.value) {
						criteria = this.excludeVendor(criteria);
					}
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByPostalCode;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
				case 'bacRadius': {
					const bacRadius = formData.value.selectedOption[formData.value.selectedOption.value];
					criteria = this.vlsService.locateVehiclesByVendorProximity(make.MakeID, this.maxRecord, modelCode, bacRadius, this.vendorId, year);
					criteria = this.modifyCriteria(criteria);
					if (this.searchVehicle.controls.excludeBAC['controls'].value.value) {
						criteria = this.excludeVendor(criteria);
					}
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByVendorProximity;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
				case 'BAC': {
					const BAC = _.filter(formData.value.selectedOption.BAC.number, function (number) {
						return number !== '';
					});
					criteria = this.vlsService.locateVehiclesByMultipleVendor(BAC, make.MakeID, this.maxRecord, modelCode, make.SellingSourceID, false, year);
					criteria = this.modifyCriteria(criteria);
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByMultipleVendor;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
				case 'state': {
					const selectedStates = [];
					this.targetStates.filter((state) => {
						selectedStates.push(state.stateId);
					});
					criteria = this.vlsService.locateVehiclesByRegion(make.MakeID, this.maxRecord, modelCode, make.SellingSourceID, selectedStates, year);
					criteria = this.modifyCriteria(criteria);
					if (this.searchVehicle.controls.excludeBAC['controls'].value.value) {
						criteria = this.excludeVendor(criteria);
					}
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByRegion;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
				default : {
					criteria = this.vlsService.locateVehiclesByMultipleVendor(this.vendorId, make.MakeID, this.maxRecord, modelCode, make.SellingSourceID, true, year);
					criteria = this.modifyCriteria(criteria);
					dataPromise.push(new Promise((resolve, reject) => {
						this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
							resolve(response);
						});
					}));
					Promise.all(dataPromise).then(response => {
						if (response[0].ShowVehicleInventory.Status.Code === '30000') {
							this.searchedData = response[0].ShowVehicleInventory.SearchBySingleVendor;
						} else {
							this.errorMessage[0] = response[0].ShowVehicleInventory.Status.Message;
							this.searchedData = [];
						}
						if (response[1].ShowVehicleInventory.Status.Code === '30000') {
							this.additionalData = response[1].ShowVehicleInventory.SearchByMultipleVendor;
						} else {
							this.errorMessage[1] = response[1].ShowVehicleInventory.Status.Message;
							this.additionalData = [];
						}
						this.loading = false;
						this.result = true;
					});
					break;
				}
			}
		} else {
			if (!this.searchVehicle.controls.yearMakeModel.valid || this.selectBodyError) {
				window.scrollTo(0, 0);
			} else if (!this.searchVehicle.controls.selectedOption.valid || this.selectStateError) {
				window.scrollBy(0, 500);
			} else if (this.invalidExcludeBAC || !this.searchVehicle.controls.excludeBAC.valid) {
				window.scrollTo(0, 700);
			}
		}
	}

	getOptions($event) {
		this.options = $event;
	}

	getMakes(year) {
		this.vssService.getAllMakes(year).subscribe(response => {
			this.makes = response;
			this.searchVehicle.controls.yearMakeModel['controls'].make.enable();
		});
	}

	getOptionList(selectedBodyStyle) {
		this.showSelectionOption = false;
		const selectOptionPromise = [];
		_.each(selectedBodyStyle, function (value, i) {
			selectOptionPromise.push(new Promise((resolve, reject) => {
				this.vssService.getModelOptionGroup(this.selectedYear, this.selectedMake.MakeID, value.modelId).subscribe(response => {
					resolve(response);
				});
			}));
		}.bind(this));
		Promise.all(selectOptionPromise).then(function (values) {
			this.modelOptionGroups = this.selectedBodyStyle.length === 0 ? [] : values;
			this.showSelectionOption = true;
			this.allSelected = this.selectedBodyStyle.length === this.bodyStyles[this.selectedModel].length;
			this.selectBodyError = this.searchVehicleForm.submitted && !this.selectedBodyStyle.length;
		}.bind(this));
	}

	hideListButtons() {
		if (document.getElementsByClassName('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only').length) {
			document.getElementsByClassName('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only')[0].setAttribute('icon', 'fa-angle-double-right');
			document.getElementsByClassName('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only')[1].setAttribute('style', 'display:none');
			document.getElementsByClassName('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only')[2].setAttribute('icon', 'fa-angle-double-left');
			document.getElementsByClassName('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only')[3].setAttribute('style', 'display:none');
		}
	}

	modifyCriteria(criteria) {
		if (this.options && this.options.FamilyOption.length) {
			criteria.VehicleSpecification['FamilyOptionPreference'] = {
				FamilyOption: this.options.FamilyOption
			};
		}
		const selectedVehicleType = _.groupBy(this.vehicleSearchType, 'option');
		criteria.OutputSpecification = {
			'IncludeAvailableFinancing': false,
			'IncludeHistory': false,
			'IncludeModelInfo': true,
			'IncludeOptions': false,
			'IncludePricing': true,
			'IncludeReservationInfo': false,
			'IncludeStatus': true,
			'IncludeVendorAssigned': false,
			'IncludeVendorDetail': true,
			'OptionDescriptionType': 'DEFAULT',
			'IncludeProgramCodes': false,
			'IncludeCTPVehicles': selectedVehicleType['IncludeCTPVehicles'][0].checked,
			'IncludeTotalCashAllowance': selectedVehicleType['IncludeTotalCashAllowance'][0].checked,
			'IncludeOptionLevelPricing': selectedVehicleType['IncludeOptionLevelPricing'][0].checked,
			'IncludeSoldFleetVehicles': selectedVehicleType['IncludeSoldFleetVehicles'][0].checked,
			'IncludeDemoVehicles': selectedVehicleType['IncludeDemoVehicles'][0].checked,
			'IncludeDMSInventoryInfo': true,
			'IncludeServiceCampaigns': false
		};
		return criteria;
	}

	moveToSource($event) {
		this.sourceStates = _.sortBy(this.sourceStates, 'name');
		this.selectStateError = !this.targetStates.length;
	}

	moveToTarget(event) {
		if (this.targetStates.length > 5) {
			this.sourceStates = this.sourceStates.concat(this.targetStates.splice(5, this.targetStates.length));
		}
		this.sourceStates = _.sortBy(this.sourceStates, 'name');
		this.targetStates = _.sortBy(this.targetStates, 'name');
		this.selectStateError = !this.targetStates.length;
	}

	onClearData(event) {
		window.scrollTo(0, 0);
		this.clearData = true;
		this.searchVehicle.reset();
		this.selectedBodyStyle = [];
		this.allSelected = false;
	}

	onMakeChange(event) {
		this.searchVehicle.controls.yearMakeModel['controls'].model.disable();
		this.models = [];
		this.bodyStyles = {};
		this.selectedBodyStyle = [];
		this.allSelected = false;
		this.showSelectionOption = false;
		this.vssService.getAllModels(this.selectedYear, event.value.MakeID).subscribe(response => {
			const model = response.ModelList.Model;
			_.each(model, function (value, valueIndex) {
				const modelValue = value.Description.split(': ')[0];
				const index = this.models.indexOf(modelValue);
				if (index === -1) {
					this.models.push(value.Description.split(': ')[0]);
				}
				if (Object.keys(this.bodyStyles).indexOf(modelValue) === -1) {
					this.bodyStyles[modelValue] = [];
				}
				this.bodyStyles[modelValue].push({
					modelId: value.ModelID,
					style: `${value.ModelID} - ${value.Description.split(': ')[1]}`
				});
			}.bind(this));
			this.models.sort();
			this.searchVehicle.controls.yearMakeModel['controls'].model.reset();
			this.searchVehicle.controls.yearMakeModel['controls'].model.enable();
		});
	}

	onModelChange(event) {
		this.checkedValue = new Array(this.bodyStyles[event.value].length);
		this.selectedBodyStyle = [];
		this.allSelected = false;
		this.showSelectionOption = false;
	}

	onYearChange(event) {
		this.searchVehicle.controls.yearMakeModel['controls'].make.reset();
		this.searchVehicle.controls.yearMakeModel['controls'].make.disable();
		this.searchVehicle.controls.yearMakeModel['controls'].model.reset();
		this.searchVehicle.controls.yearMakeModel['controls'].model.disable();
		this.selectedBodyStyle = [];
		this.allSelected = false;
		this.showSelectionOption = false;
		this.getMakes(event.value);
	}

	openSearchByLocation() {
		const dialogRef = this.dialog.open(SearchBacComponent, {
			width: '60%',
			data: {
				quickLinks: true
			}
		});
	}

	selectAll(event) {
		const that = this;
		this.selectedBodyStyle = [];
		this.selectBodyError = this.searchVehicleForm.submitted && !event.checked;
		if (event.checked) {
			this.selectedBodyStyle = _.concat(this.selectedBodyStyle, this.bodyStyles[this.selectedModel]);
		}
		this.allSelected = event.checked;
		_.each(this.checkedValue, function (item, index) {
			that.checkedValue[index] = event.checked;
		});
		this.getOptionList(this.selectedBodyStyle);
	}

	showAlert(event, value) {
		if (this.searchVehicle.controls.excludeBAC.value.value) {
			event.preventDefault();
			const dialogRef = this.dialog.open(AlertComponent, {
				data: {field: `Search By ${value}`}
			});
		}
	}

	validateExcludeBAC() {
		return !this.searchVehicle.value.excludeBAC.bacs.join().replace(/,/g, '').length;
	}
}

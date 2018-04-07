import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';

import * as _ from 'lodash';

import { environment } from '../../../environments/environment';
import { VISService } from '../../services/vis.services';
import { PrintService } from '../../services/print.services';

@Component({
	selector: 'general-motor-search-vehicle-result',
	templateUrl: './search-vehicle-result.component.html',
	styleUrls: ['./search-vehicle-result.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
			state('expanded', style({height: '*', visibility: 'visible'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	]
})
export class SearchVehicleResultComponent implements OnInit, AfterViewInit {

	@Output() editSearch = new EventEmitter<any>();

	@Input() selectedSearch: any;
	@Input() data: any;
	@Input() additionalData: any;
	@Input() searchCriteria: any;
	@Input() errorMessage: any;

	@ViewChild('inventoryTable', {read: MatSort}) inventoryDataSort: MatSort;
	@ViewChild('inventoryTable', {read: MatPaginator}) inventoryDataPaginator: MatPaginator;

	@ViewChild('additionalCriteriaTable', {read: MatSort}) additionalDataSort: MatSort;
	@ViewChild('additionalCriteriaTable', {read: MatPaginator}) additionalDataPaginator: MatPaginator;

	public inventoryDataSource: any;
	public additionalDataSource: any;
	public addedToPartner: any;
	public addedToPartnerError: any;
	public compareError: any;
	public reportError: any;
	public additionalTitle: string;
	public allSelected = [];
	public inventorySelected = [];
	public inventoryCheckedValue: Array<any>;
	public inventoryAllSelected = false;
	public additionalSelected = [];
	public additionalCheckedValue: Array<any>;
	public additionalAllSelected = false;
	public views = ['Customer', 'Dealer'];
	public selectedView = 'Dealer';
	public displayedColumns = ['selected', 'VIN', 'PEG', 'color', 'trim', 'engine', 'trans', 'owningDealer', 'eventCode',
		'stock', 'orderType', 'MSRP', 'otherInformation'];
	public loading = false;

	constructor(
		private visService: VISService,
		private titleService: Title,
		private printService: PrintService
	) {  }

	ngAfterViewInit() {
		this.inventoryDataSource.sort = this.inventoryDataSort;
		this.inventoryDataSource.paginator = this.inventoryDataPaginator;
		this.additionalDataSource.sort = this.additionalDataSort;
		this.additionalDataSource.paginator = this.additionalDataPaginator;
	}

	ngOnInit() {
		this.titleService.setTitle('Locate Vehicle Search Result');
		_.each(this.data, function (item) {
			item.PEG = _.find(item.Option, {FamilyCode: 'SPP'});
			item.primaryColor = _.find(item.Option, {FamilyCode: 'CCU'});
			item.trim = _.find(item.Option, {FamilyCode: 'ITC'});
			item.transmission = _.find(item.Option, {FamilyCode: 'TRN'});
			item.engine = _.find(item.Option, {FamilyCode: 'ENG'});
			item.MSRP = _.find(item.Price, {Type: 'MSRP'}) || {};
			item.VIN = item.VinNumber.substr(item.VinNumber.length - 8);
		});
		_.each(this.additionalData, function (item) {
			item.PEG = _.find(item.Option, {FamilyCode: 'SPP'});
			item.primaryColor = _.find(item.Option, {FamilyCode: 'CCU'});
			item.trim = _.find(item.Option, {FamilyCode: 'ITC'});
			item.transmission = _.find(item.Option, {FamilyCode: 'TRN'});
			item.engine = _.find(item.Option, {FamilyCode: 'ENG'});
			item.MSRP = _.find(item.Price, {Type: 'MSRP'}) || {};
			item.VIN = item.VinNumber.substr(item.VinNumber.length - 8);
		});

		this.inventoryDataSource = new MatTableDataSource(this.data);
		this.additionalDataSource = new MatTableDataSource(this.additionalData);

		this.inventoryCheckedValue = new Array(this.data ? this.data.length : 0);
		this.additionalCheckedValue = new Array(this.additionalData ? this.additionalData.length : 0);

		switch (this.searchCriteria.additionalCriteria.selectedOption.value) {
			case 'Zip Code': {
				const {code, radius} = this.searchCriteria.additionalCriteria.selectedOption['Zip Code'];
				this.additionalTitle = `Zip Code ${code}, ${radius} Miles`;
				break;
			}
			case 'City': {
				const {city, state, radius} = this.searchCriteria.additionalCriteria.selectedOption['City'];
				this.additionalTitle = `City ${city}, State List ${state.abbr}, ${radius} Mile`;
				break;
			}
			case 'BAC': {
				const BAC = _.filter(this.searchCriteria.additionalCriteria.selectedOption['BAC'].number, function (number) {
					return number !== '';
				});
				this.additionalTitle = `BAC ${BAC.toString()}`;
				break;
			}
			case 'state': {
				const states = [];
				_.each(this.searchCriteria.additionalCriteria.selectedOption['state'], function (stateName) {
					states.push(stateName.name);
				});
				this.additionalTitle = `${states.toString()} (State List)`;
				break;
			}
			case 'bacRadius': {
				const bacRadius = this.searchCriteria.additionalCriteria.selectedOption['bacRadius'];
				this.additionalTitle = `BAC ${ this.searchCriteria.vendorId } ${ bacRadius } Mile`;
				break;
			}
			default: {
				this.additionalTitle = `My Trading Partner`;
				break;
			}
		}
		this.searchCriteria.searchedCriteria.splice(1, 0, {value: this.additionalTitle});
	}

	addToTradingPartner() {
		this.addedToPartner = true;
	}

	checkBoxChange(event, index, tableName) {
		this.reportError = false;
		this.compareError = false;
		this.addedToPartnerError = false;

		if (tableName === 'inventoryTable') {
			if (event.checked) {
				this.inventorySelected.push(JSON.parse(event.source.value));
			} else {
				this.inventorySelected.splice(this.inventorySelected.indexOf(JSON.parse(event.source.value)), 1);
			}
			this.inventoryCheckedValue[index] = event.checked;
			this.inventoryAllSelected = this.inventorySelected.length === this.data.length;
		} else {
			if (event.checked) {
				this.additionalSelected.push(JSON.parse(event.source.value));
			} else {
				this.additionalSelected.splice(this.additionalSelected.indexOf(JSON.parse(event.source.value)), 1);
			}
			this.additionalCheckedValue[index] = event.checked;
			this.additionalAllSelected = this.additionalSelected.length === this.additionalData.length;
		}
		this.allSelected = this.inventorySelected.concat(this.additionalSelected);
	}

	compareVehicle() {
		if (this.allSelected.length <= 1 || this.allSelected.length > 4) {
			this.compareError = true;
			this.reportError = false;
			window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
		} else {
			const vinNumbers = [];
			this.allSelected.filter(function (selected) {
				vinNumbers.push(selected.VinNumber);
			}.bind(this));
			window.open(`${environment.baseURL}/${environment.compareVehicle}?vin=${vinNumbers.toString()}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
		}
	}

	editSearchClick() {
		this.editSearch.emit();
	}

	printInvoice(element) {
		this.loading = true;
		this.visService.getVehicleInvoiceDocs(element.InvoiceNumber).subscribe(response => {
			this.printService.printInvoice(response.invoiceDocText);
			this.loading = false;
		});
	}

	selectAll(event, tableName) {
		const that = this;
		this.reportError = false;
		this.compareError = false;
		if (tableName === 'inventoryTable') {
			this.inventorySelected = [];
			this.inventoryAllSelected = event.checked;
			if (event.checked) {
				this.inventorySelected = _.concat(this.inventorySelected, this.data);
			}
			_.each(this.inventoryCheckedValue, function (item, index) {
				that.inventoryCheckedValue[index] = event.checked;
			});
		} else {
			this.additionalSelected = [];
			this.additionalAllSelected = event.checked;
			if (event.checked) {
				this.additionalSelected = _.concat(this.additionalSelected, this.additionalData);
			}
			_.each(this.additionalCheckedValue, function (item, index) {
				that.additionalCheckedValue[index] = event.checked;
			});
		}
		this.allSelected = this.inventorySelected.concat(this.additionalSelected);
	}

	showOwningDealerDetail(vehicle) {
		window.open(`${environment.baseURL}/${environment.dealerDetail}?bac=${vehicle.Dealer.DealerCode}`, '_blank', `location=yes,scrollbars=yes,status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	showIncentives(vehicle) {
		window.open(`${environment.crmUrl}/?fuseaction=gm.IomIncentivesV1&VIN=${vehicle.VinNumber}&suppresslayout=true`, '_blank', `location=yes,scrollbars=yes,status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	showVinDetail(element) {
		window.open(`${environment.baseURL}/${environment.vinDetail}?vin=${element.VinNumber}`, '_blank', `location=yes,scrollbars=yes,status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	viewReport() {
		if (!this.allSelected.length) {
			this.reportError = true;
			this.compareError = false;
			window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
		} else {
			const vins = [];
			this.allSelected.filter((detail, index) => {
				vins.push(detail.VinNumber);
			});
			window.open(`${environment.baseURL}/${environment.viewReport}?view=${this.selectedView.toLowerCase()}&pageName=results&vin=${vins.toString()}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
		}
	}
}

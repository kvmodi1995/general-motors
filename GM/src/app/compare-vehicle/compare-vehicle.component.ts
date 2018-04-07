import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { environment } from '../../environments/environment';
import { res } from '../api-response/response';
import { PrintService, VLSService, VISService } from '../services/index';

declare const jsPDF;

@Component({
	selector: 'general-motor-compare-vehicle',
	templateUrl: './compare-vehicle.component.html',
	styleUrls: ['./compare-vehicle.component.scss']
})
export class CompareVehicleComponent implements OnInit {
	public vin: any;
	public header: any;
	public response: any;
	public comparision: any;
	public comparisionOptions: any;
	public selectedView = 'Customer';
	public result: any;
	public loading: boolean;
	public enablePrint = false;
	public sameOption: any;
	public allOptions: any;
	public differentOption: any;
	public newData: any;

	constructor(private activatedRoute: ActivatedRoute,
							private printService: PrintService,
							private visService: VISService,
							private vlsService: VLSService) {
	}

	ngOnInit() {
		this.loading = true;
		this.allOptions = [];
		this.newData = {};
		this.activatedRoute
			.queryParams
			.subscribe(params => {
				this.vin = params['vin'].split(',');
			});
		this.loading = true;
		const that = this, vinDetailPromise = [];
		_.each(this.vin, function (vin) {
			vinDetailPromise.push(new Promise((resolve, reject) => {
				const criteria = that.vlsService.locateVehicleByVin(vin);
				that.vlsService.getSearchVehicleData(criteria).subscribe(response => {
					resolve(response);
				});
			}));
		});
		Promise.all(vinDetailPromise).then(function (results) {
			that.result = [];
			_.each(results, function (response) {
				const data = response.ShowVehicleInventory.SearchByVIN[0];
				data.PEG = _.find(data.Option, {FamilyCode: 'SPP'});
				data.primaryColor = _.find(data.Option, {FamilyCode: 'CCU'});
				data.trim = _.find(data.Option, {FamilyCode: 'ITC'});
				data.transmission = _.find(data.Option, {FamilyCode: 'TRN'});
				data.engine = _.find(data.Option, {FamilyCode: 'ENG'});
				data.MSRP = _.find(data.Price, {Type: 'MSRP'});
				data.employeePrice = _.find(data.Price, {Type: 'employeePrice'});
				data.supplierPrice = _.find(data.Price, {Type: 'supplierPrice'});
				data.invoice310 = _.find(data.Price, {Type: 'invoice310'});
				data.listOfOptions = [];
				_.each(data.Option, function (option) {
					data.listOfOptions.push(option.OptionCode);
					if (Object.keys(that.allOptions).indexOf(option.OptionCode) === -1) {
						that.allOptions[option.OptionCode] = option.OptionDescription;
					}
				});
				data.VIN = data.VinNumber.substr(data.VinNumber.length - 8);
				that.result.push(data);
				that.newData[data.VinNumber] = data.listOfOptions;
			});
			that.enablePrint = true;
			that.loading = false;
			switch (that.result.length) {
				case 2 : {
					that.sameOption = _.intersection(that.result[0].listOfOptions, that.result[1].listOfOptions);
					break;
				}
				case 3 : {
					that.sameOption = _.intersection(that.result[0].listOfOptions, that.result[1].listOfOptions, that.result[2].listOfOptions);
					document.getElementById('comparision-body').classList.add('full-comparision-table');
					break;
				}
				case 4 : {
					that.sameOption = _.intersection(that.result[0].listOfOptions, that.result[1].listOfOptions, that.result[2].listOfOptions, that.result[3].listOfOptions);
					document.getElementById('comparision-body').classList.add('full-comparision-table');
					break;
				}
				default : {
					break;
				}
			}
			that.differentOption = _.difference(Object.keys(that.allOptions), that.sameOption);
		});
		this.response = res.vehicleComparison;
		this.comparision = this.response.responseRoot2;
		this.comparisionOptions = _.groupBy(this.comparision, {optionType: 'Different Options'});
	}

	printDoc() {
		const doc = new jsPDF('p', 'pt', 'a4');
		const img = new Image();

		function getImageData(src) {
			return new Promise((resolve) => {
				img.src = src;
				img.onload = function () {
					const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
					canvas.width = img.width;
					canvas.height = img.height;
					context.drawImage(img, 0, 0, img.width, img.height);
					resolve(canvas.toDataURL('image/png'));
				};
			});
		}

		getImageData('assets/images/correct.png').then(correctImage => {
			const correct = correctImage;
			getImageData('assets/images/gm_logo.gif').then((image) => {
				doc.setFontSize(18);
				doc.setTextColor(40);
				doc.setFontStyle('normal');
				doc.setFillColor(19, 67, 115);
				doc.rect(30, 20, doc.internal.pageSize.width - 60, 30, 'F');
				doc.addImage(image, 'jpg', 30, 20, 30, 30);
				doc.setTextColor('#134373');
				doc.text('Side by Side Comparision', 30, 80);

				const compareVehicle = document.getElementById('vehicle-comparision'),
					differentOptions = document.getElementById('vehicle-different-option'),
					similarOptions = document.getElementById('vehicle-similar-option');

				const compareVehicleTableOption = {
					margin: {
						left: 30,
						top: 95
					},
					theme: 'grid',
					styles: {
						overflow: 'linebreak'
					},
					columnStyles: {
						0: {columnWidth: 80}
					},
					headerStyles: {
						fillColor: [158, 168, 193]
					}
				};
				const compareVehicleTableRes = doc.autoTableHtmlToJson(compareVehicle);
				if (this.selectedView === 'Customer') {
					compareVehicleTableRes.data = compareVehicleTableRes.data.splice(0, compareVehicleTableRes.data.length - 1);
				} else {
					compareVehicleTableRes.data = compareVehicleTableRes.data.splice(0, compareVehicleTableRes.data.length - 2);
				}
				doc.autoTable(compareVehicleTableRes.columns, compareVehicleTableRes.data, compareVehicleTableOption);

				let differentCorrects = [];
				const differentOptionTableOption = {
					startY: doc.autoTable.previous.finalY + 10,
					margin: {
						left: 30
					},
					theme: 'striped',
					styles: {
						overflow: 'linebreak'
					},
					columnStyles: {
						0: {columnWidth: 200}
					},
					headerStyles: {
						fillColor: [255, 255, 255],
						textColor: 1
					},
					drawCell: function (cell, opts) {
						if (opts.column.dataKey !== 0 && cell.text[0] === 'done') {
							differentCorrects.push({
								url: correct,
								x: cell.textPos.x,
								y: cell.textPos.y - 3
							});
							cell.text[0] = '';
						}
					},
					addPageContent: function () {
						for (let i = 0; i < differentCorrects.length; i++) {
							doc.addImage(differentCorrects[i].url, differentCorrects[i].x, differentCorrects[i].y, 20, 20);
						}
						differentCorrects = [];
					}
				};
				const differentOptionTableRes = doc.autoTableHtmlToJson(differentOptions);
				doc.autoTable(differentOptionTableRes.columns, differentOptionTableRes.data, differentOptionTableOption);

				let similarCorrects = [];
				const similarOptionTableOption = {
					startY: doc.autoTable.previous.finalY + 10,
					margin: {
						left: 30
					},
					theme: 'striped',
					styles: {
						overflow: 'linebreak'
					},
					columnStyles: {
						0: {columnWidth: 200}
					},
					headerStyles: {
						fillColor: [255, 255, 255],
						textColor: 1
					},
					drawCell: function (cell, opts) {
						if (opts.column.dataKey !== 0 && cell.text[0] === 'done') {
							similarCorrects.push({
								url: correct,
								x: cell.textPos.x,
								y: cell.textPos.y - 3
							});
							cell.text[0] = '';
						}
					},
					addPageContent: function () {
						for (let i = 0; i < similarCorrects.length; i++) {
							doc.addImage(similarCorrects[i].url, similarCorrects[i].x, similarCorrects[i].y, 20, 20);
						}
						similarCorrects = [];
					}
				};
				const similarOptionTableRes = doc.autoTableHtmlToJson(similarOptions);
				doc.autoTable(similarOptionTableRes.columns, similarOptionTableRes.data, similarOptionTableOption);

				doc.setFontSize(10);
				doc.setTextColor('#134373');
				doc.text('Disclaimer:', 30, doc.autoTable.previous.finalY + 15);
				doc.setFillColor(158, 168, 193);
				doc.rect(30, doc.autoTable.previous.finalY + 18, doc.internal.pageSize.width - 60, 52, 'F');
				doc.setTextColor(255, 255, 255);
				const div = document.getElementById('vin-disclaimer-text');
				const strArr = doc.splitTextToSize(div.innerText, 520);
				doc.text(strArr, 35, doc.autoTable.previous.finalY + 30);
				const blob = doc.output('blob');
				window.open(URL.createObjectURL(blob), '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
			});
		});

	}

	printInvoice(InvoiceNumber) {
		this.loading = true;
		this.visService.getVehicleInvoiceDocs(InvoiceNumber).subscribe(response => {
			this.printService.printInvoice(response.invoiceDocText);
			this.loading = false;
		});
	}

	printAllInvoice() {
		this.loading = true;
		const that = this;
		const invoiceDocsPromise = [];
		_.each(this.result, function (data) {
			invoiceDocsPromise.push(
				new Promise(function (resolve) {
					that.visService.getVehicleInvoiceDocs(data.InvoiceNumber).subscribe(response => {
						resolve(response);
					});
				}));
		});
		Promise.all(invoiceDocsPromise).then(function (invoices) {
			const allInvoices = [];
			_.each(invoices, function (invoice) {
				allInvoices.push(invoice.invoiceDocText);
			});
			that.loading = false;
			that.printService.printAllInvoice(allInvoices);
		});
	}

	showIncentives(vehicle) {
		console.log('showIncentives', vehicle);
		window.open(`${environment.crmUrl}/?fuseaction=gm.IomIncentivesV1&VIN=${vehicle.VinNumber}&suppresslayout=true`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}
}

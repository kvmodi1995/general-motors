import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { VLSService } from '../services/vls.services';
import { res } from '../api-response/response';
import { environment } from '../../environments/environment';

declare const jsPDF;

export declare interface PriceObject {
	Value: number;
	Type: string;
	CurrencyID: string;
}


@Component({
	selector: 'general-motor-detail-report',
	templateUrl: './detail-report.component.html',
	styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {

	public displayAdditionalVehicleInfo = true;
	public displayGmMarketingInfo = true;
	public reportType = 'detail';
	public reportFor = 'customer';
	public vinNumber: string;
	public customer_company: string;
	public address: string;
	public salesConsultant: string;
	public data: any;
	public MSRP: PriceObject;
	public employeePrice: PriceObject;
	public supplierPrice: PriceObject;
	public invoice310: PriceObject;
	public listOfOptions: Array<any>;
	public tradeContact: any;
	public enablePrint = false;
	public loading = false;

	constructor(public router: Router,
							private vlsService: VLSService,
							private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		const that = this;
		this.activatedRoute
			.queryParams
			.subscribe(params => {
				this.vinNumber = params.vin.split(',');
				this.reportFor = params.view || 'customer';
				this.reportType = params.pageName === 'vehicledetail' || params.pageName === 'results' ? 'detail' : 'summary';
			});
		const vinDetailPromise = [];
		this.loading = true;
		that.enablePrint = true;
		_.each(this.vinNumber, function (vin) {
			vinDetailPromise.push(new Promise((resolve, reject) => {
				const criteria = that.vlsService.locateVehicleByVin(vin);
				that.vlsService.getSearchVehicleData(criteria).subscribe(response => {
					resolve(response);
				});
			}));
		});
		Promise.all(vinDetailPromise).then(function (results) {
			that.data = [];
			that.enablePrint = true;
			_.each(results, function (result) {
				that.data = that.data.concat(result.ShowVehicleInventory.SearchByVIN);
				_.each(that.data, (data) => {
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
					});
				});
			});
			that.loading = false;
		});
		/*this.vlsService.getTradeContact(this.vinNumber).subscribe(response =>{
     })*/
		this.tradeContact = res.tradeContactInfo.response;
		_.each(this.tradeContact, (contact) => {
			contact.id = contact.contactType === 'P' ? 'Primary' : (contact.contactType === 'S' ? 'Secondary' : '');
		});
	}

	toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	printReport() {
		const doc = new jsPDF('p', 'pt', 'a4');
		const img = new Image();

		function getImageData() {
			return new Promise((resolve) => {
				img.src = 'assets/images/gm_logo.gif';
				img.onload = function () {
					const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
					canvas.width = img.width;
					canvas.height = img.height;
					context.drawImage(img, 0, 0, img.width, img.height);
					resolve(canvas.toDataURL('image/png'));
				};
			});
		}

		getImageData().then((image) => {
				doc.setFontSize(20);
				doc.setTextColor(40);
				doc.setFontStyle('normal');
				doc.setFillColor(19, 67, 115);
				doc.rect(30, 20, doc.internal.pageSize.width - 60, 30, 'F');
				doc.addImage(image, 'png', 30, 20, 30, 30);
				doc.setTextColor('#134373');
				doc.text(this.toTitleCase(`${this.reportType} Report For ${this.reportFor}`), 30, 80);
				let pdf;
				if (this.reportFor === 'dealer') {
					if (this.reportType === 'detail') {
						pdf = this.getDetailDealerDoc(doc);
					} else {
						const span: any = document.getElementsByClassName('sub-title-border');
						doc.setFontSize(15);
						doc.text(span[0].innerHTML, 30, 100);
						pdf = this.getSummaryDealerDoc(doc);
					}
				} else {
					doc.setFontSize(10);
					doc.text(`Company/Customer: ${this.customer_company || ''}\t\t Sales Consultant: ${this.salesConsultant || ''}`, 30, 100);
					doc.text(`Address: ${this.address || ''}`, 30, 120);
					if (this.reportType === 'detail') {
						pdf = this.getDetailCustomerDoc(doc);
					} else {
						pdf = this.getSummaryCustomerDoc(doc);
					}
				}

				const file = pdf.output('blob');
				window.open(URL.createObjectURL(file), '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
		});
	}

	getDetailDealerDoc(doc) {
		const vehicleElem = document.getElementsByClassName('vehicle-detail');
		const owningTableElem = document.getElementsByClassName('owning-dealer-table');
		const bodyTableElem = document.getElementsByClassName('body-table');
		const bodyStyleElem = document.getElementsByClassName('body-style');

		_.each(this.data, function (data, index) {
			const vehicleTableOption = {
				margin: {
					top: 90,
					left: 30,
					right: 30
				},
				theme: 'plain',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [255, 255, 255],
				},
				columnStyles: {
					td: {
						fontStyle: 'bold'
					}
				}
			};
			if (_.parseInt(index) !== 0) {
				vehicleTableOption['startY'] = doc.autoTable.previous.finalY + 15;
				delete vehicleTableOption.margin.top;
			}
			const vehicleRes = doc.autoTableHtmlToJson(vehicleElem[index]);
			doc.autoTable(vehicleRes.columns, vehicleRes.data, vehicleTableOption);

			const autoTableOption = {
				startY: doc.autoTable.previous.finalY + 15,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {
					overflow: 'linebreak'
				},
				columnStyles: {
					0: {columnWidth: 50},
					1: {columnWidth: 52},
					2: {columnWidth: 50},
					3: {columnWidth: 50},
					4: {columnWidth: 30},
					5: {columnWidth: 30},
					8: {columnWidth: 50},
					9: {columnWidth: 100}
				},
				headerStyles: {
					fillColor: [158, 168, 193]
				}
			};
			const owningTableRes = doc.autoTableHtmlToJson(owningTableElem[index]);
			doc.autoTable(owningTableRes.columns, owningTableRes.data, autoTableOption);

			const bodyTableOption = {
				startY: doc.autoTable.previous.finalY + 15,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [158, 168, 193]
				}
			};
			const bodyTableRes = doc.autoTableHtmlToJson(bodyTableElem[index]);
			doc.autoTable(bodyTableRes.columns, bodyTableRes.data, bodyTableOption);

			const bodyStyleOption = {
				startY: doc.autoTable.previous.finalY + 15,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [255, 255, 255],
				},
				columnStyles: {
					0: {columnWidth: 100}
				}
			};
			const bodyStyleRes = doc.autoTableHtmlToJson(bodyStyleElem[index]);
			doc.autoTable(bodyStyleRes.columns, bodyStyleRes.data, bodyStyleOption);
		});
		return doc;
	}

	getDetailCustomerDoc(doc) {
		const detailTable = document.getElementsByClassName('customer-detail-table');
		const customerBodyTable = document.getElementsByClassName('customer-body-table');
		_.each(this.data, function (data, index) {
			const vehicleTableOption = {
				margin: {
					top: 140,
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				columnStyles: {
					0: {columnWidth: 200},
					1: {columnWidth: 200},
					2: {columnWidth: 80},
					3: {columnWidth: 'auto'}
				},
				headerStyles: {
					fillColor: [158, 168, 193]
				},
				drawRow: function (row, docData) {
					if (!row.index) {
						for (let i = 3; i > 0; i--) {
							docData.row.cells[i].text = docData.row.cells[i - 1].text;
						}
						docData.row.cells[0].text = [];
					}
				}
			};
			if (_.parseInt(index) !== 0) {
				vehicleTableOption['startY'] = doc.autoTable.previous.finalY + 15;
				delete vehicleTableOption.margin.top;
			}
			const vehicleRes = doc.autoTableHtmlToJson(detailTable[index]);
			doc.autoTable(vehicleRes.columns, vehicleRes.data, vehicleTableOption);

			const bodyStyleOption = {
				startY: doc.autoTable.previous.finalY + 15,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [255, 255, 255],
				},
				columnStyles: {
					0: {columnWidth: 100}
				}
			};
			const bodyStyleRes = doc.autoTableHtmlToJson(customerBodyTable[index]);
			doc.autoTable(bodyStyleRes.columns, bodyStyleRes.data, bodyStyleOption);
		});
		return doc;
	}

	getSummaryDealerDoc(doc) {
		const summaryTable = document.getElementsByClassName('dealer-summary-table');
		const div: any = document.getElementsByClassName('dealer-options-right');
		_.each(this.data, (data, index) => {
			const vehicleTableOption = {
				margin: {
					top: 120,
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				columnStyles: {
					0: {columnWidth: 60},
					1: {columnWidth: 50},
					2: {columnWidth: 50},
					3: {columnWidth: 50},
					4: {columnWidth: 70},
					5: {columnWidth: 70},
					8: {columnWidth: 50},
					9: {columnWidth: 50}
				},
				headerStyles: {
					fillColor: [158, 168, 193]
				}
			};
			if (_.parseInt(index) !== 0) {
				vehicleTableOption['startY'] = doc.autoTable.previous.finalY + 50;
				delete vehicleTableOption.margin.top;
			}
			const vehicleRes = doc.autoTableHtmlToJson(summaryTable[index]);
			doc.autoTable(vehicleRes.columns, vehicleRes.data, vehicleTableOption);
			doc.setFontSize(12);
			doc.text('Options:', 30, doc.autoTable.previous.finalY + 15);
			doc.setTextColor('#134373');
			doc.setFontSize(10);
			const strArr = doc.splitTextToSize(div[index].innerText, 550);
			doc.text(strArr, 30, doc.autoTable.previous.finalY + 25);
		});
		return doc;
	}

	getSummaryCustomerDoc(doc) {
		const table = document.getElementsByClassName('customer-summary-table');
		const div: any = document.getElementsByClassName('dealer-options-right');
		_.each(this.data, function (data, index) {
			const yAxis = doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY + 80 : 150;
			doc.setFontSize(15);
			doc.setTextColor('#134373');
			doc.text(`Vehicle # ${ index + 1 }:  ${ data.Year } ${data.MakeString} ${data.ModelDescription}`, 30, yAxis);
			const vehicleTableOption = {
				margin: {
					top: 160,
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				columnStyles: {
					0: {columnWidth: 120},
					1: {columnWidth: 150},
					2: {columnWidth: 50},
					3: {columnWidth: 50},
					4: {columnWidth: 50},
					5: {columnWidth: 50}
				},
				headerStyles: {
					fillColor: [158, 168, 193]
				}
			};
			if (_.parseInt(index) !== 0) {
				vehicleTableOption['startY'] = doc.autoTable.previous.finalY + 90;
				delete vehicleTableOption.margin.top;
			}
			const vehicleRes = doc.autoTableHtmlToJson(table[index]);
			doc.autoTable(vehicleRes.columns, vehicleRes.data, vehicleTableOption);
			doc.setFontSize(12);
			doc.text('Options:', 30, doc.autoTable.previous.finalY + 15);
			doc.setTextColor('#134373');
			doc.setFontSize(10);
			const strArr = doc.splitTextToSize(div[index].innerText, 550);
			doc.text(strArr, 30, doc.autoTable.previous.finalY + 30);
		});
		return doc;
	}

	showVinDetail(detail) {
		window.open(`${environment.baseURL}/${environment.vinDetail}?view=${this.reportFor}&vin=${detail.VinNumber}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}
}

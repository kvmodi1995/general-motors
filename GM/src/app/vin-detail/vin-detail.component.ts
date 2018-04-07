import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import * as _ from 'lodash';

import { res } from '../api-response/response';
import { environment } from '../../environments/environment';
import { VISService, VLSService, PrintService } from '../services/index';

declare const jsPDF;

@Component({
	selector: 'general-motor-vin-detail',
	templateUrl: './vin-detail.component.html',
	styleUrls: ['./vin-detail.component.scss']
})
export class VinDetailComponent implements OnInit {

	public displayAdditionalVehicleInfo: boolean;
	public displayGmMarketingInfo: boolean;
	public enablePrint = false;
	public selectedView = 'customer';
	public data: any = {};
	public incompleteData = [];
	public tradeContact: any;
	public loading: boolean;

	constructor(private activatedRoute: ActivatedRoute,
							private vlsService: VLSService,
							private printService: PrintService,
							private visService: VISService) {
	}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.loading = true;
			this.selectedView = params.view;
			const criteria = this.vlsService.locateVehicleByVin(params.vin);
			this.vlsService.getSearchVehicleData(criteria).subscribe(response => {
				this.data = response.ShowVehicleInventory.SearchByVIN ? response.ShowVehicleInventory.SearchByVIN[0] : {};
				this.enablePrint = true;
				this.loading = false;
			});
			this.tradeContact = res.tradeContactInfo.response;
			_.each(this.tradeContact, (contact) => {
				contact.id = contact.contactType === 'P' ? 'Primary' : (contact.contactType === 'S' ? 'Secondary' : '');
			});
		});
		this.displayAdditionalVehicleInfo = true;
		this.displayGmMarketingInfo = true;
	}

	addToTradingPartner() {
	}

	changeView(event) {
		this.selectedView = event.value;
	}

	emailCustomer() {
	}

	viewReport() {
		window.open(`${environment.baseURL}/${environment.viewReport}?view=${this.selectedView}&pageName=vehicledetail&vin=${this.data['VinNumber']}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	printInvoice() {
		this.loading = true;
		this.visService.getVehicleInvoiceDocs(this.data.InvoiceNumber).subscribe(response => {
			this.printService.printInvoice(response.invoiceDocText);
			this.loading = false;
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
			doc.setTextColor('#FFFFFF');
			doc.text('Vehicle Locator', 70, 42);

			const dealerDetail = document.getElementById('dealer-address');
			const dealerDetailOption = {
				margin: {
					top: 60,
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [158, 168, 193],
				}
			};
			const dealerDetailRes = doc.autoTableHtmlToJson(dealerDetail);
			doc.autoTable(dealerDetailRes.columns, dealerDetailRes.data, dealerDetailOption);

			const vinSpecificationLeft = document.getElementById('vin-specification-left');
			const vinSpecificationRight = document.getElementById('vin-specification-right');
			const vinSpecificationOption = {
				startY: doc.autoTableEndPosY() + 15,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'plain',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [158, 168, 193],
				}
			};
			const vinSpecificationLeftRes = doc.autoTableHtmlToJson(vinSpecificationLeft);
			const vinSpecificationRightRes = doc.autoTableHtmlToJson(vinSpecificationRight);
			_.each(vinSpecificationRightRes.data, (row, index: number) => {
				if (index) {
					if (vinSpecificationLeftRes.data[index - 1] === undefined) {
						vinSpecificationLeftRes.data[index - 1] = ['', ''].concat(row);
					} else {
						vinSpecificationLeftRes.data[index - 1] = vinSpecificationLeftRes.data[index - 1].concat(row);
					}
				}
			});
			const vinSpecificationRes = {
				columns: vinSpecificationLeftRes.columns.concat(vinSpecificationRightRes.columns),
				data: vinSpecificationLeftRes.data
			};
			doc.autoTable(vinSpecificationRes.columns, vinSpecificationRes.data, vinSpecificationOption);

			if (this.selectedView === 'dealer') {
				const incompleteDataOptions = {
					startY: doc.autoTableEndPosY() + 15,
					margin: {
						left: 30,
						right: 30
					},
					theme: 'grid',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [158, 168, 193],
						textColor: [255, 255, 255],
						lineWidth: 1,
					}
				};
				doc.autoTable([`Open/Incomplete Field Action(s): ${this.incompleteData.length || 'None'}`], [], incompleteDataOptions);
			}

			const additionalVehicleInformation = {
				startY: doc.autoTableEndPosY() + (this.selectedView === 'dealer' ? 1 : 15),
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [255, 255, 255],
					textColor: [0, 0, 0],
					lineWidth: 1,
				},
				columnStyles: {
					0: {columnWidth: 200},
				}
			};
			doc.autoTable(['Display Additional Vehicle Information', this.data['vehicleInformation'] || ''], [], additionalVehicleInformation);
			const marketingTextOptions = {
				startY: doc.autoTableEndPosY() + 1,
				margin: {
					left: 30,
					right: 30
				},
				theme: 'grid',
				styles: {overflow: 'linebreak'},
				headerStyles: {
					fillColor: [255, 255, 255],
					textColor: [0, 0, 0],
					lineWidth: 1,
				},
				columnStyles: {
					0: {columnWidth: 200},
				}
			};
			doc.autoTable(['Display Additional Vehicle Information', this.data['MarketingText'] || ''], [], marketingTextOptions);

			doc.setFontSize(10);
			doc.setTextColor('#134373');
			doc.setFontType('bold');
			doc.text('Vehicle Options:', 35, doc.autoTableEndPosY() + 25);
			if (document.getElementById('all-options')) {
				const chargeableOptionTableOptions = {
					startY: doc.autoTableEndPosY() + 45,
					margin: {
						left: 40,
						right: 40
					},
					theme: 'grid',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [158, 168, 193]
					}
				};
				const chargeableOptionTable = document.getElementById('all-options');
				let chargeableOptionRes;
				if (!chargeableOptionTable) {
					chargeableOptionRes = {
						columns: ['All Options'],
						data: []
					};
					chargeableOptionTableOptions.headerStyles.fillColor = [255, 255, 255];
					chargeableOptionTableOptions.headerStyles['textColor'] = [19, 67, 115];
				} else {
					doc.text('All Options', 40, doc.autoTableEndPosY() + 38);
					chargeableOptionRes = doc.autoTableHtmlToJson(chargeableOptionTable);
				}
				doc.autoTable(chargeableOptionRes.columns, chargeableOptionRes.data, chargeableOptionTableOptions);
			} else {
				const chargeableOptionTableOptions = {
					startY: doc.autoTableEndPosY() + 45,
					margin: {
						left: 40,
						right: 40
					},
					theme: 'grid',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [158, 168, 193]
					},
					columnStyles: {
						0: {columnWidth: 200},
					}
				};
				const chargeableOptionTable = document.getElementById('chargeable-options');
				let chargeableOptionRes;
				if (!chargeableOptionTable) {
					chargeableOptionRes = {
						columns: ['Chargeable Options'],
						data: []
					};
					chargeableOptionTableOptions.headerStyles.fillColor = [255, 255, 255];
					chargeableOptionTableOptions.headerStyles['textColor'] = [19, 67, 115];
				} else {
					doc.text('Chargeable Options', 40, doc.autoTableEndPosY() + 38);
					chargeableOptionRes = doc.autoTableHtmlToJson(chargeableOptionTable);
				}
				doc.autoTable(chargeableOptionRes.columns, chargeableOptionRes.data, chargeableOptionTableOptions);

				const noCostOptionTableOptions = {
					startY: doc.autoTableEndPosY() + 1,
					margin: {
						left: 40,
						right: 40
					},
					theme: 'plain',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [255, 255, 255],
						textColor: [19, 67, 115]
					}
				};
				const noCostOptionTable = document.getElementById('no-cost-options');
				let noCostOptionRes;
				if (!noCostOptionTable) {
					noCostOptionRes = {
						columns: ['No Cost Options'],
						data: []
					};
				} else {
					noCostOptionRes = doc.autoTableHtmlToJson(noCostOptionTable);
				}
				doc.autoTable(noCostOptionRes.columns, noCostOptionRes.data, noCostOptionTableOptions);

				const otherOptionTableOptions = {
					startY: doc.autoTableEndPosY(),
					margin: {
						left: 40,
						right: 40
					},
					theme: 'plain',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [255, 255, 255],
						textColor: [19, 67, 115]
					}
				};
				const otherOptionTable = document.getElementById('other-options');
				let otherOptionRes;
				if (!otherOptionTable) {
					otherOptionRes = {
						columns: ['Other Options'],
						data: []
					};
				} else {
					otherOptionRes = doc.autoTableHtmlToJson(otherOptionTable);
				}
				doc.autoTable(otherOptionRes.columns, otherOptionRes.data, otherOptionTableOptions);
			}


			if (this.selectedView === 'dealer') {
				const owningDealerDetail = document.getElementById('dealer-detail');
				const owningDealerDetailOption = {
					startY: doc.autoTableEndPosY() + 20,
					margin: {
						left: 30,
						right: 30
					},
					theme: 'grid',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [158, 168, 193],
					},
					columnStyles: {}
				};
				const owningDealerDetailRes = doc.autoTableHtmlToJson(owningDealerDetail);
				doc.autoTable(owningDealerDetailRes.columns, owningDealerDetailRes.data, owningDealerDetailOption);

				const dealerDetailTable = document.getElementsByClassName('owning-dealer-table');
				const dealerDetailTableOption = {
					startY: doc.autoTableEndPosY() + 10,
					margin: {
						left: 30,
						right: 30
					},
					theme: 'grid',
					styles: {overflow: 'linebreak'},
					headerStyles: {
						fillColor: [158, 168, 193],
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
					}
				};
				const dealerDetailTableRes = doc.autoTableHtmlToJson(dealerDetailTable[0]);
				doc.autoTable(dealerDetailTableRes.columns, dealerDetailTableRes.data, dealerDetailTableOption);
			}

			doc.setFontSize(10);
			doc.setTextColor('#134373');
			doc.text('"~" indicates vehicle belongs to Trading Partner\'s inventory', 30, doc.autoTableEndPosY() + 15);
			doc.text('Disclaimer:', 30, doc.autoTableEndPosY() + 25);
			doc.setFillColor(158, 168, 193);
			doc.rect(30, doc.autoTableEndPosY() + 30, doc.internal.pageSize.width - 60, 52, 'F');
			doc.setTextColor(255, 255, 255);
			const div = document.getElementById('vin-disclaimer-text');
			const strArr = doc.splitTextToSize(div.innerText, 520);
			doc.text(strArr, 40, doc.autoTableEndPosY() + 42);
			const file = doc.output('blob');
			window.open(URL.createObjectURL(file), '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
		});
	}

	showIncentives() {
		window.open(`${environment.crmUrl}/?fuseaction=gm.IomIncentivesV1&VIN=${this.data.VinNumber}&suppresslayout=true`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}
}

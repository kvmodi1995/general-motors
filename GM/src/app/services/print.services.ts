import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';

declare const jsPDF;

@Injectable()
export class PrintService {

	constructor() { }

	printInvoice(textDoc) {
		const invoiceDoc = textDoc.split('\n');
		const pdf = new jsPDF('p', 'pt');
		pdf.setFont('courier');
		pdf.setFontType('normal');
		pdf.setFontSize(8);
		_.each(invoiceDoc, (doc, index: number) => {
			const lineIndex = index % 75;
			if (index !== 0 && index % 75 === 0) {
				pdf.addPage();
			}
			const yAxis = (lineIndex * 10) + 50;
			pdf.text(doc, 50, yAxis);
		});
		const blob = pdf.output('blob');
		window.open(URL.createObjectURL(blob), '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	printAllInvoice(textDoc) {
		const pdf = new jsPDF('p', 'pt');
		pdf.setFont('courier');
		pdf.setFontType('normal');
		pdf.setFontSize(8);
		_.each(textDoc, (invoice, invoiceIndex) => {
			const invoiceDoc = invoice.split('\n');
			if (invoiceIndex) {
				pdf.addPage();
			}
			_.each(invoiceDoc, (doc, index: number) => {
				const lineIndex = index % 75;
				if (index !== 0 && index % 75 === 0) {
					pdf.addPage();
				}
				const yAxis = (lineIndex * 10) + 50;
				pdf.text(doc, 50, yAxis);
			});
		});
		const blob = pdf.output('blob');
		window.open(URL.createObjectURL(blob), '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class VISService {

	constructor(private http: Http) { }

	getVehicleInvoiceDocs(invoiceNumber) {
		return this.http.get(`${environment.serverURL}/${environment.visURL}/invoices/${invoiceNumber}`)
			.map((response) => {
				return response.json();
			});
	}

	getVehicleInvoices(vinNumber) {
		return this.http.get(`${environment.serverURL}/${environment.visURL}/invoices?original_document=true&vin=${vinNumber}`)
			.map((response) => {
				return response.json();
			});
	}
}

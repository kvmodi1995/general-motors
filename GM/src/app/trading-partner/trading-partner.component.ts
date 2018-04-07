import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import * as _ from 'lodash';

import { res } from '../api-response/response';
import { environment } from '../../environments/environment';

@Component({
	selector: 'general-motor-trading-partner',
	templateUrl: './trading-partner.component.html',
	styleUrls: ['./trading-partner.component.scss']
})
export class TradingPartnerComponent implements OnInit, AfterViewInit {

	public displayedColumns = ['selected', 'vendorId', 'name', 'vendorCode', 'addresses', 'phone', 'fax'];
	public selection = new SelectionModel(true, []);
	public data: any;
	public dataSource: any;
	public selectDataError: any;

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private router: Router) { }

	ngOnInit() {
		this.data = res.tradingPartner.dealerResponse.dealers;
		_.each(this.data, function (dealer) {
			dealer.addresses = dealer.address.addressAsString;
			dealer.phone = dealer.dealerContact[0].phone;
			dealer.fax = dealer.dealerContact[0].fax;
		});
		this.dataSource = new MatTableDataSource(this.data);
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	/** Whether all filtered rows are selected. */
	isAllFilteredRowsSelected() {
		return this.dataSource.filteredData.every(data => this.selection.isSelected(data));
	}

	/** Whether the selection it totally matches the filtered rows. */
	isMasterToggleChecked() {
		return this.selection.hasValue() &&
			this.isAllFilteredRowsSelected() &&
			this.selection.selected.length >= this.dataSource.filteredData.length;
	}

	/**
   * Whether there is a selection that doesn't capture all the
   * filtered rows there are no filtered rows displayed.
   */
	isMasterToggleIndeterminate() {
		return this.selection.hasValue() &&
			(!this.isAllFilteredRowsSelected() || !this.dataSource.filteredData.length);
	}

	/** Selects all filtered rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		if (this.isMasterToggleChecked()) {
			this.selection.clear();
		} else {
			this.dataSource.filteredData.forEach(data => this.selection.select(data));
		}
	}

	removeBAC() {
		this.selectDataError = !this.selection.selected.length;
	}

	openDealerDetailPage(element) {
		window.open(`${environment.baseURL}/${environment.dealerDetail}?bac=${element.vendorId}`, '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

	openSearchBAC() {
		this.router.navigateByUrl('popup/locate-dealer');
	}

	printReport(event) { }
}

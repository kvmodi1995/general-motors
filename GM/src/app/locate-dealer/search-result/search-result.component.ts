import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'general-motor-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, AfterViewInit {

	@Output() editSearchClicked = new EventEmitter<any>();
	@Input() data: any;
	@Input() searchCriteria: any;
	@Input() division: any;
	@Input() selectedSearch: any;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	public displayedColumns = ['selected', 'BAC', 'dealerName', 'owingDealerCode', 'Address', 'phone', 'fax'];
	public selection = new SelectionModel(true, []);
	public dataSource: any;
	public today = new Date();
	public addedToPartner = false;
	public addedToPartnerError = false;

	constructor(private titleService: Title) { }

	ngOnInit() {
	  this.titleService.setTitle('Locate Dealer Search Result');
		this.dataSource = new MatTableDataSource(this.data);
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	addToTradingPartner() {
		this.addedToPartner = true;
	}

	editSearchClick() {
		this.editSearchClicked.emit();
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
}

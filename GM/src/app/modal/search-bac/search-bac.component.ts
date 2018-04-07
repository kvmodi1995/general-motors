import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'general-motor-search-bac',
	templateUrl: './search-bac.component.html',
	styleUrls: ['./search-bac.component.scss']
})
export class SearchBacComponent implements OnInit {

	constructor(public dialogRef: MatDialogRef<SearchBacComponent>) { }

	ngOnInit() { }

	closeModal() {
		this.dialogRef.close();
	}
}

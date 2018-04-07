import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'general-motor-selected-options',
	templateUrl: './selected-options.component.html',
	styleUrls: ['./selected-options.component.scss']
})
export class SelectedOptionsComponent implements OnInit {

	public objectKeys = Object.keys;

	constructor(
		public dialogRef: MatDialogRef<SelectedOptionsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() { }

	closeModal() {
		this.dialogRef.close();
	}
}

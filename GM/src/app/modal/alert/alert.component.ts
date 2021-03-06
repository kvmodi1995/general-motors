import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
	selector: 'general-motor-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

	constructor(
	  public dialogRef: MatDialogRef<AlertComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() { }

	closeDialog() {
		this.dialogRef.close();
	}

}

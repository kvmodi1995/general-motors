import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
	selector: 'general-motor-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

	@Input() showRoutes: boolean;

	public environment = environment;

	constructor() { }

	ngOnInit() { }

}

import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
	selector: 'general-motor-quick-links',
	templateUrl: './quick-links.component.html',
	styleUrls: ['./quick-links.component.scss']
})
export class QuickLinksComponent implements OnInit {
	@Input() selectView: any;
	public selectedView = 'customer';

	constructor() { }

	ngOnInit() { }

	openTradingPartner() {
		window.open(`${environment.baseURL}/${environment.tradingPartner}`, '_blank', `location=yes, scrollbars=yes, status=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../../environments/environment';

@Component({
	selector: 'general-motor-info-navbar',
	templateUrl: './info-navbar.component.html',
	styleUrls: ['./info-navbar.component.scss']
})
export class InfoNavbarComponent implements OnInit {

	@Input() showHelp: boolean;
	@Input() showPrint: boolean;
	@Input() enablePrint: boolean;
	@Output() printClicked = new EventEmitter<any>();
	public environment = environment;

	constructor(private titleService: Title) { }

	ngOnInit() { }

	print(event) {
		this.printClicked.emit(event);
	}

	openHelpfulLinks() {
		let title = this.titleService.getTitle();
		title = title.replace(/ /g, '_').toUpperCase();
		window.open(`${environment.baseURL}/${environment.helpfulLink}?pageId=${title}`, '_blank', `location=yes, height=${screen.availHeight * 0.9}, width=${screen.availWidth * 0.9}`);
	}

}

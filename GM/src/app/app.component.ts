import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'general-motor-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public showHeader = false;
	public showRoute = false;
	public showHelp = false;

	constructor(router: Router, titleService: Title) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				const title = this.getTitle(router.routerState, router.routerState.root).join('-');
				this.showHeader = event.url === '/' || event.url.startsWith('/locate') || event.url.startsWith('/popup');
				this.showRoute = event.url === '/' || event.url.startsWith('/locate');
				this.showHelp = event.url === '/' || event.url.startsWith('/locate');
				titleService.setTitle(title);
			}
		});
	}

	title = 'general-motor';

	getTitle(state, parent) {
		const data = [];
		if (parent && parent.snapshot.data && parent.snapshot.data.title) {
			data.push(parent.snapshot.data.title);
		}

		if (state && parent) {
			data.push(... this.getTitle(state, state.firstChild(parent)));
		}
		return data;
	}
}

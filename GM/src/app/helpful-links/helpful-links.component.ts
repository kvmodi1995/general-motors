import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'general-motor-helpful-links',
	templateUrl: './helpful-links.component.html',
	styleUrls: ['./helpful-links.component.scss']
})
export class HelpfulLinksComponent implements OnInit {
	title: string;

	constructor(private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			const title = params.pageId.replace(/_/g, ' ').toLowerCase();
			this.title = title.includes('Result') ? 'Viewing ' : 'Using ' + title;
		});
	}

}

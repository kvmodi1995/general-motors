import { async, inject, TestBed } from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpModule, Http, XHRBackend, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { VISService } from './vis.services';
import { res } from '../api-response/response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('VISService (mockBackend)', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				HttpModule
			],
			providers: [
				VISService,
				BaseRequestOptions,
				MockBackend,
				{provide: XHRBackend, useClass: MockBackend},
				{
					deps: [
						MockBackend,
						BaseRequestOptions
					],
					provide: Http,
					useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					}
				}
			]
		}).compileComponents();
	}));

	it('can instantiate service when inject service', inject([VISService], (service: VISService) => {
		expect(service instanceof VISService).toBe(true);
	}));

	it('can instantiate service with "new"', inject([Http], (http: Http) => {
		expect(http).not.toBeNull('http should be provided');
		const service = new VISService(http);
		expect(service instanceof VISService).toBe(true, 'new service should be ok');
	}));

	it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
		expect(backend).not.toBeNull('backend should be provided');
	}));

	describe('when getVehicleInvoiceDocs() called', () => {
		let subject: VISService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VISService, MockBackend, Http], (visService: VISService, mockBackend: MockBackend) => {
			subject = visService;
			backend = mockBackend;
		}));

		it('length of response should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({
					body: res.getVehicleInvoiceDocs
				});
				connection.mockRespond(new Response(options));
			});

			subject.getVehicleInvoiceDocs('1OD58786392').subscribe(response => {
				expect(response.invoiceDocText).toBeTruthy();
			});
		});

		it('response should contain status success', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({body: res.getVehicleInvoiceDocs});
				connection.mockRespond(new Response(options));
			});

			subject.getVehicleInvoiceDocs('1OD58786392').subscribe(response => {
				expect(response.Status).toEqual({
					'Message': '200 OK',
					'Code': '200'
				});
			});
		});
	});
});

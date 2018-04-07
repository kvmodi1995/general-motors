import { async, inject, TestBed } from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpModule, Http, XHRBackend, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { VLSService } from './vls.services';
import { res } from '../api-response/response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('VLSService (mockBackend)', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				HttpModule
			],
			providers: [
				VLSService,
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

	it('can instantiate service when inject service', inject([VLSService], (service: VLSService) => {
		expect(service instanceof VLSService).toBe(true);
	}));

	it('can instantiate service with "new"', inject([Http], (http: Http) => {
		expect(http).not.toBeNull('http should be provided');
		const service = new VLSService(http);
		expect(service instanceof VLSService).toBe(true, 'new service should be ok');
	}));

	it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
		expect(backend).not.toBeNull('backend should be provided');
	}));

	describe('when getSearchVehicleData() called', () => {
		let subject: VLSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VLSService, MockBackend, Http], (vlsService: VLSService, mockBackend: MockBackend) => {
			subject = vlsService;
			backend = mockBackend;
		}));

		it('length of response should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({
					body: res.locateVehicleByVin
				});
				connection.mockRespond(new Response(options));
			});

			const criteria = {
				'maxItems': '10',
				'FilterCriteria': {
					'ExcludedVendorId': {
						'VendorId': ['118420', '263584']
					}
				},
				'SearchCriteria': {
					'SearchBySingleVendor': {
						'VendorId': '263584'
					}
				},
				'VehicleSpecification': {
					'MakeCode': '001',
					'MerchandisingModelDesignator': [
						'CG33503'
					],
					'SellingSourceCode': '13',
					'Year': 2017
				}
			};

			subject.getSearchVehicleData(criteria).subscribe(response => {
				expect(response.ShowVehicleInventory.SearchByVIN.length).toBeGreaterThan(0);
			});
		});

		it('response should contain status success', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({body: res.locateVehicleByVin});
				connection.mockRespond(new Response(options));
			});

			const criteria = {
				'maxItems': '10',
				'FilterCriteria': {
					'ExcludedVendorId': {
						'VendorId': ['118420', '263584']
					}
				},
				'SearchCriteria': {
					'SearchBySingleVendor': {
						'VendorId': '263584'
					}
				},
				'VehicleSpecification': {
					'MakeCode': '001',
					'MerchandisingModelDesignator': [
						'CG33503'
					],
					'SellingSourceCode': '13',
					'Year': 2017
				}
			};

			subject.getSearchVehicleData(criteria).subscribe(response => {
				expect(response.ShowVehicleInventory.Status.Message).toBe('Success');
			});
		});
	});
});

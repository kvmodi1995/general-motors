import { async, inject, TestBed } from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpModule, Http, XHRBackend, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { VSSService } from './vss.services';
import { res } from '../api-response/response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('VSSService (mockBackend)', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				HttpModule
			],
			providers: [
				VSSService,
				BaseRequestOptions,
				MockBackend,
				{ provide: XHRBackend, useClass: MockBackend },
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

	it('can instantiate service when inject service', inject([VSSService], (service: VSSService) => {
		expect(service instanceof VSSService).toBe(true);
	}));

	it('can instantiate service with "new"', inject([Http], (http: Http) => {
		expect(http).not.toBeNull('http should be provided');
		const service = new VSSService(http);
		expect(service instanceof VSSService).toBe(true, 'new service should be ok');
	}));

	it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
		expect(backend).not.toBeNull('backend should be provided');
	}));

	describe('when getAllMakes() called', () => {
		let subject: VSSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VSSService, MockBackend, Http], (vssService: VSSService, mockBackend: MockBackend) => {
			subject = vssService;
			backend = mockBackend;
		}));

		it('length of response(makes) should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllMakes });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make.length).toBeGreaterThan(0);
			});
		});

		it('length of response(makes) should match', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllMakes });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make.length).toBe(res.getAllMakes.ModelYears[0].MakeList.Make.length);
			});
		});

		it('response(makes) should contain specific record', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllMakes });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make[0]).toEqual({
					'Description': 'Buick',
					'MakeID': '004',
					'SellingSourceID': '11'
				});
			});
		});

	});

	describe('when getAllModels() called', () => {
		let subject: VSSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VSSService, MockBackend, Http], (vssService: VSSService, mockBackend: MockBackend) => {
			subject = vssService;
			backend = mockBackend;
		}));

		it('length of response(models) should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllModels });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make[0].ModelList.Model.length).toBeGreaterThan(0);
			});
		});

		it('length of response(models) should match', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllModels });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make[0].ModelList.Model.length)
					.toBe(res.getAllModels.ModelYears[0].MakeList.Make[0].ModelList.Model.length);
			});
		});

		it('response(models) should contain specific record', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllModels });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].MakeList.Make[0].ModelList.Model[0])
					.toEqual({
					'Description': '1500 Silverado: LWB, 2WD, Reg Cab Pickup',
					'ModelID': 'CC15903'
				});
			});
		});

	});

	describe('when getAllYears() called', () => {
		let subject: VSSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VSSService, MockBackend, Http], (vssService: VSSService, mockBackend: MockBackend) => {
			subject = vssService;
			backend = mockBackend;
		}));

		it('length of response(years) should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllYears });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears.length).toBeGreaterThan(0);
			});
		});

		it('length of response(years) should match', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllYears });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears.length).toBe(res.getAllYears.ModelYears.length);
			});
		});

		it('response(years) should contain specific record', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getAllYears });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.ModelYears[0].Year).toEqual('2013');
			});
		});

	});

	describe('when getModelOptionGroup() called', () => {
		let subject: VSSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VSSService, MockBackend, Http], (vssService: VSSService, mockBackend: MockBackend) => {
			subject = vssService;
			backend = mockBackend;
		}));

		it('length of response(modelOptionGroup) should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getModelOptionGroup });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.OptionGroup.length).toBeGreaterThan(0);
			});
		});

		it('length of response(modelOptionGroup) should match', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getModelOptionGroup });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.OptionGroup.length).toBe(res.getModelOptionGroup.OptionGroup.length);
			});
		});
	});

	describe('when getStates() called', () => {
		let subject: VSSService = null;
		let backend: MockBackend = null;

		beforeEach(inject([VSSService, MockBackend, Http], (vssService: VSSService, mockBackend: MockBackend) => {
			subject = vssService;
			backend = mockBackend;
		}));

		it('length of response(states) should be greater than 0', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getStates });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.length).toBeGreaterThan(0);
			});
		});

		it('length of response(states) should match', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getStates });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response.length).toBe(res.getStates.length);
			});
		});

		it('response(states) should contain specific record', () => {
			backend.connections.subscribe((connection: MockConnection) => {
				const options = new ResponseOptions({ body: res.getStates });
				connection.mockRespond(new Response(options));
			});

			subject.getStates().subscribe((response) => {
				expect(response[0]).toEqual({
					'country': {
						'id': 0,
						'name': 'USA'
					},
					'id': 1,
					'abbr': 'AL',
					'name': 'Alabama'
				});
			});
		});

	});
});

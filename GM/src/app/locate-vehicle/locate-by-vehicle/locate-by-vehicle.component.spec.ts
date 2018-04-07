/*
import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {PickListModule} from 'primeng/primeng';
import {MaterialModule} from '../../material.module';

import {
	LocateByVehicleComponent,
	SearchVehicleResultComponent,
	SelectOptionComponent
} from '../index';
import {QuickLocateComponent} from '../../quick-locate/quick-locate.component';
import {QuickLinksComponent} from '../../quick-links/quick-links.component';

import {SearchCriteriaComponent} from '../../search-criteria/search-criteria.component';
import {VSSService} from '../../services/vss.services';
import {VLSService} from '../../services/vls.services';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CustomCurrencyPipe} from '../../pipes/customPipes';
import {MockVLSService, MockVSSService} from '../../services/testing/index';
import {By} from '@angular/platform-browser';

describe('LocateByVehicleComponent', () => {

	let comp: LocateByVehicleComponent;
	let fixture: ComponentFixture<LocateByVehicleComponent>;
	let vssService: any;
	let vlsService: any;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				FormsModule,
				HttpModule,
				MaterialModule,
				PickListModule,
				ReactiveFormsModule
			],
			declarations: [
				CustomCurrencyPipe,
				LocateByVehicleComponent,
				QuickLinksComponent,
				QuickLocateComponent,
				SearchCriteriaComponent,
				SearchVehicleResultComponent,
				SelectOptionComponent
			],
			providers: [
				VLSService,
				VSSService,
				{provide: VSSService, useClass: MockVSSService},
				{provide: VLSService, useClass: MockVLSService}
			]
		}).compileComponents().then(() => {
			fixture = TestBed.createComponent(LocateByVehicleComponent);
			comp = fixture.componentInstance;
			vssService = fixture.debugElement.injector.get(VSSService);
			vlsService = fixture.debugElement.injector.get(VLSService);
		});
	}));


	it('should NOT have years before ngOnInit', async(() => {
		expect(comp.years.length).toBe(0);
	}));

	it('should NOT have makes before ngOnInit', async(() => {
		expect(comp.makes.length).toBe(0);
	}));

	it('should NOT have models before ngOnInit', async(() => {
		expect(comp.models.length).toBe(0);
	}));

	describe('get data after ngOnInit() called', () => {

		// Trigger component so it gets states, years, makes and vendorId to them
		beforeEach(async(() => {
			fixture.detectChanges(); // runs ngOnInit -> getStates, getAllYears, getAllMakes, getVendorID
			fixture.whenStable() // No need for the `lastPromise` hack!
				.then(() => fixture.detectChanges()); // bind to heroes
		}));

		it('should have years', () => {
			expect(comp.years.length).toBeGreaterThan(0,
				'should have years after service promise resolves');
		});

		it('should have makes', () => {
			expect(comp.makes.length).toBeGreaterThan(0,
				'should have makes after service promise resolves');
		});

		it('should display selected year', () => {
			// Find and examine the displayed year
			// Look for them in the DOM by id
			const year = fixture.debugElement.query(By.css('#selected-year'));
			expect(parseInt(year.nativeElement.innerText)).toBe(2017);
		});

		it('should display selected make', () => {
			// Find and examine the displayed make
			// Look for them in the DOM by id
			const make = fixture.debugElement.query(By.css('#selected-make'));
			make.nativeElement.value = comp.makes[0];
			fixture.detectChanges();
			fixture.whenStable()
				.then(() => fixture.detectChanges());
		});
	});
});

*/

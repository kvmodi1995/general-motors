import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PickListModule } from 'primeng/primeng';

import { CompareVehicleComponent } from './compare-vehicle/compare-vehicle.component';
import { CustomCurrencyPipe, CustomTimeZonePipe } from './pipes/index';
import { DealerDetailComponent } from './dealer-detail/dealer-detail.component';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { FooterComponent } from './footer/footer.component';
import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';
import { InfoNavbarComponent } from './info-navbar/info-navbar.component';
import {
	LocateByVehicleComponent,
	SearchVehicleResultComponent,
	SelectOptionComponent
} from './locate-vehicle/index';
import { NavbarComponent } from './navbar/navbar.component';
import { OtherLinksComponent } from './other-links/other-links.component';
import { OwningDealerComponent } from './table/index';
import { QuickLinksComponent } from './quick-links/quick-links.component';
import { QuickLocateComponent } from './quick-locate/quick-locate.component';
import { SearchByLocationComponent, SearchResultComponent } from './locate-dealer/index';
import { SearchCriteriaComponent } from './search-criteria/search-criteria.component';
import { StandardPaymentEstimatorComponent } from './standard-payment-estimator/standard-payment-estimator.component';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import {
	VehicleOptionsComponent,
	VinDetailComponent,
	VinSpecificationComponent } from './vin-detail/index';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AppRoutingModule,
				FormsModule,
				MaterialModule,
				PickListModule,
				RouterTestingModule,
				ReactiveFormsModule
			],
			declarations: [
				AppComponent,
				CompareVehicleComponent,
				CustomCurrencyPipe,
				CustomTimeZonePipe,
				DealerDetailComponent,
				DetailReportComponent,
				FooterComponent,
				HelpfulLinksComponent,
				InfoNavbarComponent,
				LocateByVehicleComponent,
				NavbarComponent,
				OwningDealerComponent,
				QuickLinksComponent,
				QuickLocateComponent,
				SearchByLocationComponent,
				SearchCriteriaComponent,
				SearchResultComponent,
				SearchVehicleResultComponent,
				SelectOptionComponent,
				TradingPartnerComponent,
				VinDetailComponent,
				VinSpecificationComponent,
				VehicleOptionsComponent,
				StandardPaymentEstimatorComponent,
				OtherLinksComponent
			],
		}).compileComponents();
	}));
	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
	it(`should have as title 'general-motor'`, async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('general-motor');
	}));
});

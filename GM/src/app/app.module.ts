import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { PickListModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';

import { AlertComponent, SearchBacComponent } from './modal/index';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CompareVehicleComponent } from './compare-vehicle/compare-vehicle.component';
import { CustomCurrencyPipe, CustomTimeZonePipe } from './pipes/index';
import { DealerDetailComponent } from './dealer-detail/dealer-detail.component';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { FooterComponent } from './footer/footer.component';
import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';
import { HttpAuthModule } from './intercepter/httpAuth.module';
import { InfoNavbarComponent } from './info-navbar/info-navbar.component';
import { LocateByVehicleComponent, SearchVehicleResultComponent, SelectedOptionsComponent, SelectOptionComponent } from './locate-vehicle/index';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { OtherLinksComponent } from './other-links/other-links.component';
import { OwningDealerComponent } from './table/index';
import { PrintService, VISService, VLSService, VSSService } from './services/index';
import { QuickLinksComponent } from './quick-links/quick-links.component';
import { QuickLocateComponent } from './quick-locate/quick-locate.component';
import { SearchByLocationComponent, SearchResultComponent } from './locate-dealer/index';
import { SearchCriteriaComponent } from './search-criteria/search-criteria.component';
import { StandardPaymentEstimatorComponent } from './standard-payment-estimator/standard-payment-estimator.component';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import { VehicleOptionsComponent, VinDetailComponent, VinSpecificationComponent } from './vin-detail/index';

@NgModule({
	imports: [
		AccordionModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		HttpAuthModule,
		MaterialModule,
		ReactiveFormsModule,
		PickListModule
	],
	declarations: [
		AlertComponent,
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
		OtherLinksComponent,
		OwningDealerComponent,
		QuickLinksComponent,
		QuickLocateComponent,
		SearchBacComponent,
		SearchByLocationComponent,
		SearchCriteriaComponent,
		SearchResultComponent,
		SearchVehicleResultComponent,
		SelectedOptionsComponent,
		SelectOptionComponent,
		StandardPaymentEstimatorComponent,
		TradingPartnerComponent,
		VehicleOptionsComponent,
		VinDetailComponent,
		VinSpecificationComponent
	],
	entryComponents: [
		AlertComponent,
		SearchBacComponent,
		SelectedOptionsComponent
	],
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		{ provide: 'Window',  useValue: window },
		PrintService,
		VISService,
		VLSService,
		VSSService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

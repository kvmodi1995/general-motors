import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchByLocationComponent } from './locate-dealer/search-by-location/search-by-location.component';
import { LocateByVehicleComponent } from './locate-vehicle/locate-by-vehicle/locate-by-vehicle.component';
import { VinDetailComponent } from './vin-detail/vin-detail.component';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { CompareVehicleComponent } from './compare-vehicle/compare-vehicle.component';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import { DealerDetailComponent } from './dealer-detail/dealer-detail.component';
import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';

const routes: Routes = [
	{path: 'locate-dealer', component: SearchByLocationComponent, data: {title: 'Locate Dealer'}},
	{path: 'popup/locate-dealer', component: SearchByLocationComponent, data: {title: 'Locate Dealer'}},
	{path: 'locate-vehicle', component: LocateByVehicleComponent, data: {title: 'Locate Vehicle'}},
	{path: 'vin-detail', component: VinDetailComponent, data: {title: 'Vin Detail'}},
	{path: 'view-report', component: DetailReportComponent, data: {title: 'Detail Report'}},
	{path: 'compare-vehicle', component: CompareVehicleComponent, data: {title: 'Side by Side Comparision'}},
	{path: 'trading-partner', component: TradingPartnerComponent, data: {title: 'Trading Partner'}},
	{path: 'popup/dealer-detail', component: DealerDetailComponent, data: {title: 'Dealer Detail'}},
	{path: 'popup/helpful-link', component: HelpfulLinksComponent, data: {title: 'Helpful Links'}},
	{path: '**', redirectTo: 'locate-vehicle'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

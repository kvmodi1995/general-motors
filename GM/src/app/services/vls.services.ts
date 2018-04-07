import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class VLSService {

	constructor(private http: Http) { }

	getVendorID() {
		return this.http.get(`${environment.serverURL}/${environment.bacURL}?service=VLS`)
			.map((response) => {
				return response.json();
			});
	}

	// api to get searched data
	getSearchVehicleData(data) {
		return this.http.post(`${environment.serverURL}/${environment.vlsURL}/vehicle-inventory`, data)
			.map((response) => {
				return response.json();
			});
	}

	// get List of Vehicles by City
	locateVehiclesByCity(city, makeCode, maxItems, modelCode, radius, sellingSourceId, state, year) {
		return {
			'maxItems': maxItems,
			'SearchCriteria': {
				'SearchByCity': {
					'City': city,
					'Proximity': radius,
					'RegionCode': state
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': sellingSourceId,
				'Year': year
			}
		};
	}

	// get List of Vehicles by Vendor(BAC)
	locateVehiclesByMultipleVendor(vendorId, makeCode, maxItems, modelCode, sellingSourceId, tradingPartnerSearch, year) {
		return {
			'maxItems': maxItems,
			'SearchCriteria': {
				'SearchByMultipleVendor': {
					'isTradingPartnerSearch': tradingPartnerSearch,
					'VendorId': vendorId
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': sellingSourceId,
				'Year': year
			}
		};
	}

	// get List of Vehicles by PostalCode
	locateVehiclesByPostalCode(makeCode, maxItems, modelCode, postalCode, radius, sellingSourceId, year) {
		return {
			'maxItems': maxItems,
			'SearchCriteria': {
				'SearchByPostalCode': {
					'PostalCode': postalCode,
					'Proximity': radius
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': sellingSourceId,
				'Year': year
			}
		};
	}

	// get List of Vehicles by State
	locateVehiclesByRegion(makeCode, maxItems, modelCode, sellingSourceId, states, year) {
		return {
			'maxItems': maxItems,
			'SearchCriteria': {
				'SearchByRegion': {
					'RegionCode': states
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': sellingSourceId,
				'Year': year
			}
		};
	}

	// get List of Vehicles by Single Vendor(BAC)
	locateVehiclesBySingleVendor(makeCode, maxItems, modelCode, sellingSourceId, vendorId, year) {
		return {
			'maxItems': maxItems,
			'SearchCriteria': {
				'SearchBySingleVendor': {
					'VendorId': vendorId // '263584'
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': sellingSourceId,
				'Year': year
			}
		};
	}

	// get List of Vehicles by vendor's proximity(radius)
	locateVehiclesByVendorProximity(makeCode, maxItems, modelCode, radius, vendorId, year) {
		return {
			'MaxItems': maxItems,
			'SearchCriteria': {
				'SearchByVendorProximity': {
					'Proximity': radius,
					'VendorId': vendorId // 263584
				}
			},
			'VehicleSpecification': {
				'MakeCode': makeCode,
				'MerchandisingModelDesignator': [
					modelCode
				],
				'SellingSourceCode': '13',
				'Year': year
			}
		};
	}

	// get List of Vehicles by VIN
	locateVehicleByVin(vinNumber) {
		return {
			'SearchCriteria': {
				'SearchByVIN': {
					'VinNumber': vinNumber,
					'PostalCode': '97214'
				}
			},
			'OutputSpecification': {
				'IncludeAvailableFinancing': true,
				'IncludeModelInfo': true,
				'IncludeOptionLevelPricing': true,
				'IncludeOptions': true,
				'IncludePricing': true,
				'IncludeServiceCampaigns': true,
				'IncludeStatus': true,
				'IncludeTotalCashAllowance': true,
				'IncludeVendorAssigned': true,
				'IncludeVendorDetail': true,
			}
		};
	}
}

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	baseURL: 'http://localhost:4200/#',
	crmUrl: 'http://local.eprisecrm.com',
	locateDealer: 'locate-dealer',
	locateVehicle: 'locate-vehicle',
	vinDetail: 'vin-detail',
	viewReport: 'view-report',
	compareVehicle: 'compare-vehicle',
	tradingPartner: 'trading-partner',
	helpfulLink: 'popup/helpful-link',
	dealerDetail: 'popup/dealer-detail',
	serverURL: 'http://local.eprisecrm.com/REST',
	vssURL: 'gm/premium/vss',
	vlsURL: 'gm/premium/vls',
	visURL: 'gm/premium/vis',
	bacURL: 'gm/premium/bac'
};

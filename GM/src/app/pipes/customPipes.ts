import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
	name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

	constructor() { }

	transform(value: any, args?: any): any {
		if (!value || isNaN(value)) {
			return 'N/A';
		}
		const currencyCode = 'USD';
		const val = +value;
		const currency = new CurrencyPipe('EN');
		return val === NaN ? value : currency.transform(value, currencyCode, true);
	}
}

@Pipe({
	name: 'customTimeZone'
})
export class CustomTimeZonePipe implements PipeTransform {

	constructor() { }

	transform(value: any, args?: any): any {
		return value.toString().match(/\((.*)\)/)[1];
	}

}

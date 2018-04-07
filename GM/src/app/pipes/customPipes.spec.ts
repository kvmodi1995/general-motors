import {async, TestBed} from '@angular/core/testing';

import {CustomCurrencyPipe, CustomTimeZonePipe} from './index';

describe('CustomCurrencyPipes', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				CustomCurrencyPipe,
				CustomTimeZonePipe,
			]
		}).compileComponents();
	}));

	const currencyPipe = new CustomCurrencyPipe();

	it('transforms null to N/A', () => {
		expect(currencyPipe.transform(null)).toBe('N/A');
	});

	it('transforms non-numeric to N/A', () => {
		expect(currencyPipe.transform('UNKNOWN')).toBe('N/A');
	});

	it('transforms "1" to "$1.00"', () => {
		expect(currencyPipe.transform('1')).toBe('$1.00');
	});

});

describe('CustomTimeZonePipes', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				CustomCurrencyPipe,
				CustomTimeZonePipe
			]
		}).compileComponents();
	}));

	const timezonePipe = new CustomTimeZonePipe();

	it('transform Tue Feb 06 2018 17:06:54 GMT+0530 (IST) to IST', () => {
		expect(timezonePipe.transform('Tue Feb 06 2018 17:06:54 GMT+0530 (IST)')).toBe('IST');
	});

	it('transform Tue Feb 06 2018 04:48:29 GMT-0700 (MST) to MST', () => {
		expect(timezonePipe.transform('Tue Feb 06 2018 04:48:29 GMT-0700 (MST)')).toBe('MST');
	});
});

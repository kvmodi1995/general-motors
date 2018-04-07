import { NgModule } from '@angular/core';
import { Http, RequestOptions, XHRBackend } from '@angular/http';

import { HttpAuthService } from './httpAuth.service';

@NgModule({
	providers: [
	  HttpAuthService,
		{
			provide: Http,
			useFactory: httpFactory,
			deps: [XHRBackend, RequestOptions]
		}
	],
})
export class HttpAuthModule { }

export function httpFactory(backend: XHRBackend, options: RequestOptions) {
	return new HttpAuthService(backend, options);
}

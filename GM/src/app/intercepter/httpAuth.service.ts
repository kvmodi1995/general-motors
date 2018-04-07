import { Injectable } from '@angular/core';
import { Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpAuthService extends Http {
	constructor(backend: XHRBackend, options: RequestOptions) {
		// add withCredentials to all requests
    options.withCredentials = true;
		super(backend, options);
	}

	get(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
		return super.request(url, options);
	}

}

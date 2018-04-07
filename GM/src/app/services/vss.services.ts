import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class VSSService {

	constructor(private http: Http) { }


	// auto Login
	/*autoLogin() {
    return this.http.get('https://gmcertification.dealerpeak.net/?fuseaction=agent.default&rid=9',{withCredentials: true})
      .map((response: Response) => {
      })
  }*/

	// get List Of All Makes of specified year
	getAllMakes(year) {
		return this.http.get(`${environment.serverURL}/${environment.vssURL}/years/${year}/makes`)
			.map((response) => {
				return response.json().ModelYears[0].MakeList.Make;
			});
	}

	// get List Of All Models for specific year and given makeId
	getAllModels(year, makeId) {
		return this.http.get(`${environment.serverURL}/${environment.vssURL}/years/${year}/makes/${makeId}/models`)
			.map((response) => {
				return response.json().ModelYears[0].MakeList.Make[0];
			});
	}

	// get List of all years with all makes and models
	getAllYearMakeModel(year) {
		return this.http.get(`https://gmcertification.dealerpeak.net/REST/gm/premium/vss/year-make-models?yearStart=2013&yearEnd=2017`)
			.map((response) => {
				return response.json();
			});
	}

	// get List of All Years
	getAllYears() {
		const currentYear = new Date().getFullYear();
		return this.http.get(`${environment.serverURL}/${environment.vssURL}/years?yearStart=${currentYear - 2}&yearEnd=${currentYear + 1}`)
			.map((response: Response) => {
				return response.json().ModelYears;
			});
	}

	// get model option group for selected model
	getModelOptionGroup(year, makeId, modelId) {
		return this.http.get(`${environment.serverURL}/${environment.vssURL}/years/${year}/makes/${makeId}/models/${modelId}/optiongroups`)
			.map((response) => {
				return response.json();
			});
	}

	// get All States
	getStates() {
		return this.http.get(`${environment.serverURL}/locale/state`)
			.map((response: Response) => {
				return response.json();
			});
	}
}

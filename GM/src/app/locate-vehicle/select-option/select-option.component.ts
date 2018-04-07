import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';

import { SelectedOptionsComponent } from '../selected-options/selected-options.component';

@Component({
	selector: 'general-motor-select-option',
	templateUrl: './select-option.component.html',
	styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent implements OnInit, OnChanges {

	@Input() showOptions: boolean;
	@Input() modelOptionGroup: any;
	@Output() getSelectedOptions = new EventEmitter<any>();

	selectOptions: any;
	totalSelectedWant = [];
	totalSelectedDontWant = [];
	totalWant = 0;
	totalDoNot = 0;
	selectedIndex = 0;
	searchedData = [];
	searchString = '';
	objectKeys = Object.keys;
	doNotAll: any;
	wantAll: any;

	constructor(public dialog: MatDialog) { }

	ngOnInit() {
		this.setSelectedOptions();
	}

	ngOnChanges(changes) {
		const that = this;
		this.setSelectedOptions();
		if (changes.modelOptionGroup && changes.modelOptionGroup.currentValue && this.modelOptionGroup.length) {
			this.showOptions = changes.showOptions && changes.showOptions.currentValue;
			_.each(this.modelOptionGroup, function (option, index) {
				option.OptionGroup.forEach(function (item) {
					switch (item.OptionGroupCode) {
						case 'CCU' : {
							that.selectOptions['Primary Color'].OptionCode = item.OptionGroupCode;
							that.selectOptions['Primary Color'].data = that.selectOptions['Primary Color'].data.concat(item.OptionList.Option);
							that.selectOptions['Primary Color'].data = _.uniqBy(that.selectOptions['Primary Color'].data, 'OptionID');
							that.selectOptions['Primary Color'].data = _.sortBy(that.selectOptions['Primary Color'].data, 'OptionID');
							break;
						}
						case 'TRN' : {
							that.selectOptions.trans.OptionCode = item.OptionGroupCode;
							that.selectOptions.trans.data = that.selectOptions.trans.data.concat(item.OptionList.Option);
							that.selectOptions.trans.data = _.uniqBy(that.selectOptions.trans.data, 'OptionID');
							that.selectOptions.trans.data = _.sortBy(that.selectOptions.trans.data, 'OptionID');
							break;
						}
						case 'ITC' : {
							that.selectOptions.trim.OptionCode = item.OptionGroupCode;
							that.selectOptions.trim.data = that.selectOptions.trim.data.concat(item.OptionList.Option);
							that.selectOptions.trim.data = _.uniqBy(that.selectOptions.trim.data, 'OptionID');
							that.selectOptions.trim.data = _.sortBy(that.selectOptions.trim.data, 'OptionID');
							break;
						}
						case 'SPP' : {
							that.selectOptions.PEG.OptionCode = item.OptionGroupCode;
							that.selectOptions.PEG.data = that.selectOptions.PEG.data.concat(item.OptionList.Option);
							that.selectOptions.PEG.data = _.uniqBy(that.selectOptions.PEG.data, 'OptionID');
							that.selectOptions.PEG.data = _.sortBy(that.selectOptions.PEG.data, 'OptionID');
							break;
						}
						case 'ENG' : {
							that.selectOptions.engine.OptionCode = item.OptionGroupCode;
							that.selectOptions.engine.data = that.selectOptions.engine.data.concat(item.OptionList.Option);
							that.selectOptions.engine.data = _.uniqBy(that.selectOptions.engine.data, 'OptionID');
							that.selectOptions.engine.data = _.sortBy(that.selectOptions.engine.data, 'OptionID');
							break;
						}
						default : {
							that.selectOptions.options.OptionCode = item.OptionGroupCode;
							that.selectOptions.options.data = that.selectOptions.options.data.concat(item.OptionList.Option);
							that.selectOptions.options.data = _.uniqBy(that.selectOptions.options.data, 'OptionID');
							that.selectOptions.options.data = _.sortBy(that.selectOptions.options.data, 'OptionID');
							break;
						}
					}
				});
			});
		}
	}

	applyFilter(search) {
		this.searchedData = [];
		const regex = new RegExp(search, 'i');
		const key = Object.keys(this.selectOptions)[this.selectedIndex];
		if (search !== '') {
			_.each(this.selectOptions[key].data, function (data) {
				if ((data.OptionName.search(regex) !== -1) || (data.OptionID.search(regex) !== -1)) {
					this.searchedData.push(data);
				}
			}.bind(this));
		}
		this.getTotalWantAndDoNot(key);
	}

	getTotalWantAndDoNot(header) {
		this.totalSelectedWant = [];
		this.totalSelectedDontWant = [];
		const FamilyOption = [];
		let totalWant = 0;
		let totalDoNot = 0;
		this.selectOptions[header].totalWant = _.filter(this.selectOptions[header].data, {want: true}).length;
		this.selectOptions[header].totalDoNot = _.filter(this.selectOptions[header].data, {doNot: true}).length;
		_.forEach(this.selectOptions, function (data, index) {
			const wantOptions = _.map(_.filter(data.data, function(items) {
				return items.want;
			}), 'OptionID');

			const doNOtOptions = _.map(_.filter(data.data, function(items) {
				return items.doNot;
			}), 'OptionID');

			if (wantOptions.length) {
				FamilyOption.push({
					include: true,
					name: data.OptionCode,
					OptionCode: wantOptions
				});
			}

			if (doNOtOptions.length) {
				FamilyOption.push({
					include: false,
					name: data.OptionCode,
					OptionCode: doNOtOptions
				});
			}
			this.totalSelectedWant = this.totalSelectedWant.concat(_.filter(data.data, ['want', true]));
			this.totalSelectedDontWant = this.totalSelectedDontWant.concat(_.filter(data.data, ['doNot', true]));
			totalWant += data.totalWant || 0;
			totalDoNot += data.totalDoNot || 0;
			this.wantAll[index] = data.totalWant === data.data.length;
			this.doNotAll[index] = data.totalDoNot === data.data.length;
		}.bind(this));
		this.totalDoNot = totalDoNot;
		this.totalWant = totalWant;
		this.totalSelectedWant = _.uniqBy(this.totalSelectedWant, 'OptionID');
		this.totalSelectedDontWant = _.uniqBy(this.totalSelectedDontWant, 'OptionID');
		this.getSelectedOptions.emit({want: this.totalSelectedWant, doNot: this.totalSelectedDontWant, FamilyOption: FamilyOption});
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(SelectedOptionsComponent, {
			width: '620px',
			data: {selectOptions: this.selectOptions}
		});
	}

	selectAll(event, type, title) {
		if (this.searchedData.length) {
			_.each(this.searchedData, function (item, index) {
				if (type === 'want') {
					this.doNotAll[title] = false;
					item.want = event.checked;
					item.doNot = false;
				} else {
					this.wantAll[title] = false;
					item.want = false;
					item.doNot = event.checked;
				}
			}.bind(this));
		} else {
			_.each(this.selectOptions[title].data, function (item, index) {
				if (type === 'want') {
					this.doNotAll[title] = false;
					item.want = event.checked;
					item.doNot = false;
				} else {
					this.wantAll[title] = false;
					item.want = false;
					item.doNot = event.checked;
				}
			}.bind(this));
		}
		this.getTotalWantAndDoNot(title);
	}

	selectDoNot(event, item, header) {
		if (event.checked) {
			item.want = false;
		}
		this.getTotalWantAndDoNot(header);
	}

	selectWant(event, item, header) {
		if (event.checked) {
			item.doNot = false;
		}
		this.getTotalWantAndDoNot(header);
	}

	setSelectedOptions() {
		this.selectOptions = {
			'Primary Color': {
				data: []
			},
			trans: {
				data: []
			},
			trim: {
				data: []
			},
			PEG: {
				data: []
			},
			engine: {
				data: []
			},
			options: {
				data: []
			}
		};

		this.wantAll = {
			'Primary Color': false,
			trans: false,
			trim: false,
			PEG: false,
			engine: false,
			options: false
		};

		this.doNotAll = {
			'Primary Color': false,
			trans: false,
			trim: false,
			PEG: false,
			engine: false,
			options: false
		};
	}

	tabChanged(event) {
		this.selectedIndex = event.index;
		this.searchedData = [];
		this.searchString = '';
	}
}

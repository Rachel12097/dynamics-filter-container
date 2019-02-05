import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public title = 'filter-container';
    public filterGroup = new FormGroup({});
    public filteredData = [];
    public selectedOptions = [];
    public filterOptions = {};
    public sections = [];

    public data = [
        { id: '1', year: '1988', program: 'CTSA', keywords: ['Humans', 'Male', 'Adult'], authors: ['A', 'B', 'C'] },
        { id: '2', year: '1990', program: 'NCGC', keywords: ['Humans', 'Female', 'Adult'], authors: ['B', 'C'] },
        { id: '3', year: '1988', program: 'CTSA', keywords: ['Humans', 'Animals'], authors: ['A', 'B'] },
        { id: '4', year: '1990', program: 'TRND', keywords: ['Male', 'Adult'], authors: ['C', 'D'] },
        { id: '5', year: '1989', program: 'CTSA', keywords: ['Humans', 'Female', 'Animals', 'Child'], authors: ['A', 'B'] },
        { id: '6', year: '1988', program: 'TRND', keywords: ['Humans', 'Female'], authors: ['A', 'B', 'D'] },
        { id: '7', year: '1989', program: 'CTSA', keywords: ['Animals'], authors: ['B', 'D'] }
    ];

    public filterConfig = [{ name: 'year' }, { name: 'program' }, { name: 'keywords' }];

    constructor() { }

    // @input

    ngOnInit() {
        // Initialize load
        // Flexible filter config
        this.filterConfig.forEach(config => {
            this.sections.push(config['name']);
        });

        this.getFilterSections(this.data);
    }

    public getFilterSections(data) {
        // Re-assign data ready for filtering
        this.filteredData = data;
        this.sections.forEach(section => this.filterOptions[section] = []);
        this.filteredData.forEach(d => {
            this.sections.forEach(section => {
                if (this.filterOptions[section].indexOf(d[section]) < 0) {
                    // If filteredData has inner array (ex: keywords or authors)
                    if (Array.isArray(d[section])) {
                        d[section].forEach(val => {
                            if (this.filterOptions[section].indexOf(val) < 0) {
                                this.filterOptions[section].push(val);
                            }
                        });
                    } else {
                        this.filterOptions[section].push(d[section]);
                    }
                }
            });
        });
        this.getFilterGroup();
    }

    public getFilterGroup() {
        this.filterGroup = new FormGroup({});
        this.sections.forEach(section => {
            const obj = {};
            this.filterOptions[section].forEach(o => {

                // Calculate count
                const count = this.calculateCount(this.filteredData, section, o);

                if (this.selectedOptions.includes(o)) {
                    this.selectedOptions.forEach(() => {
                        obj[o] = new FormGroup({
                            checked: new FormControl(true),
                            count: new FormControl(count)
                        });
                    });
                } else {
                    obj[o] = new FormGroup({
                        checked: new FormControl(false),
                        count: new FormControl(count)
                    });
                }
            });
            this.filterGroup.addControl(section, new FormGroup(obj));
        });
    }

    public calculateCount(data, section, option) {
        let count = 0;
        data.forEach(item => {
            if (section = this.getKeyByValue(item, option)) {
                return count++;
            }
        });
        return count;
    }

    public getKeys(obj) {
        return Object.keys(obj);
    }

    public getKeyByValue(obj, value) {

        return Object.keys(obj).find(function (key) {
            if (typeof obj[key] === 'string') {
                return obj[key] === value;
            }

            if (typeof obj[key] === 'object') {
                if (Object.values(obj[key]).indexOf(value) > -1) {
                    return obj[key];
                } else {
                    return;
                }
            }
        });
    }

    public onFilterChange(ev, section, option) {
        if (!this.selectedOptions.includes(option)) {
            this.selectedOptions.push(option);
            this.addFilter(section, option);
        } else {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
            this.removeFilter();
        }
    }

    public addFilter(key, val) {
        this.filteredData = this.filteredData.filter(obj => {
            if (obj[key].includes(val)) {
                return obj;
            } else {
                return;
            }
        });
        this.getFilterSections(this.filteredData);
    }

    public removeFilter() {
        // Remove all the selected options
        if (this.selectedOptions.length === 0) {
            this.filteredData = this.data;
        }

        this.selectedOptions.forEach(remainOption => {
            this.filteredData = this.data.filter(obj => {
                if (this.getKeyByValue(obj, remainOption)) {
                    return obj;
                } else {
                    return;
                }
            });
        });

        this.getFilterSections(this.filteredData);
    }

}

import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { EthiopianCalendarUI } from 'ethcal-ui';

@Component({
  selector: 'app-ethiopian-date-picker',
  template: `
    <input
      #dateInput
      type="text"
      [value]="selectedDate"
      [placeholder]="placeholder"
      (click)="showCalendar()"
      readonly
      class="ethiopian-date-input"
    />
  `,
  styles: [`
    .ethiopian-date-input {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 250px;
      cursor: pointer;
    }
  `]
})
export class EthiopianDatePickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dateInput') dateInput!: ElementRef;
  @Input() placeholder: string = 'Select date';
  @Output() dateSelect = new EventEmitter<any>();
  
  selectedDate = '';
  private calendar: any;

  ngAfterViewInit() {
    this.calendar = new EthiopianCalendarUI({
      inputElement: this.dateInput.nativeElement,
      onSelect: (date: any) => {
        const eth = date.ethiopian;
        this.selectedDate = `${eth.day}/${eth.month}/${eth.year}`;
        this.dateSelect.emit(date);
      }
    });
  }

  showCalendar() {
    this.calendar?.show();
  }

  ngOnDestroy() {
    this.calendar?.destroy();
  }
}

/*
Example usage in an Angular app:

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Ethiopian Calendar</h1>
      <app-ethiopian-date-picker (dateSelect)="handleDateSelect($event)"></app-ethiopian-date-picker>
    </div>
  `
})
export class AppComponent {
  handleDateSelect(date: any) {
    console.log('Ethiopian:', date.ethiopian);
    console.log('Gregorian:', date.gregorian);
  }
}
*/

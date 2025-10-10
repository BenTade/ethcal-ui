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
  @Input() initialDate?: Date;
  @Input() showGregorian: boolean = true;
  @Input() useAmharic: boolean = true;
  @Input() useEthiopicNumbers: boolean = false;
  @Input() mergedView: boolean = false;
  @Input() primaryCalendar: 'ethiopian' | 'gregorian' = 'ethiopian';
  @Output() dateSelect = new EventEmitter<any>();
  
  selectedDate = '';
  private calendar: any;

  ngAfterViewInit() {
    this.calendar = new EthiopianCalendarUI({
      inputElement: this.dateInput.nativeElement,
      initialDate: this.initialDate,
      showGregorian: this.showGregorian,
      useAmharic: this.useAmharic,
      useEthiopicNumbers: this.useEthiopicNumbers,
      mergedView: this.mergedView,
      primaryCalendar: this.primaryCalendar,
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
      
      <!-- Basic usage -->
      <app-ethiopian-date-picker (dateSelect)="handleDateSelect($event)"></app-ethiopian-date-picker>
      
      <!-- With Ethiopic numerals -->
      <app-ethiopian-date-picker 
        (dateSelect)="handleDateSelect($event)"
        [useEthiopicNumbers]="true">
      </app-ethiopian-date-picker>
      
      <!-- Merged view with Gregorian as primary -->
      <app-ethiopian-date-picker 
        (dateSelect)="handleDateSelect($event)"
        [mergedView]="true"
        primaryCalendar="gregorian">
      </app-ethiopian-date-picker>
      
      <!-- With initial date (Ethiopian New Year 2017) -->
      <app-ethiopian-date-picker 
        (dateSelect)="handleDateSelect($event)"
        [initialDate]="ethiopianNewYear2017">
      </app-ethiopian-date-picker>
      
      <!-- English names -->
      <app-ethiopian-date-picker 
        (dateSelect)="handleDateSelect($event)"
        [useAmharic]="false">
      </app-ethiopian-date-picker>
    </div>
  `
})
export class AppComponent {
  ethiopianNewYear2017 = new Date(2024, 8, 11); // Sept 11, 2024 = Meskerem 1, 2017
  
  handleDateSelect(date: any) {
    console.log('Ethiopian:', date.ethiopian);
    console.log('Gregorian:', date.gregorian);
  }
}
*/

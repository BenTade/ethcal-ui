# ethcal-ui

Ethiopian Calendar UI component - A beautiful, easy-to-use calendar popup for selecting Ethiopian dates in JavaScript frameworks and PHP projects.

## Features

- 🗓️ Full Ethiopian calendar with 13 months
- 🎨 Beautiful, responsive popup UI
- 📱 Mobile-friendly
- 🔄 Automatic conversion between Ethiopian and Gregorian calendars
- 🚀 Works with vanilla JS, React, Vue, Angular, and PHP
- 📦 Multiple module formats (ESM, CommonJS, UMD)
- 🎯 Zero dependencies
- 💪 TypeScript-ready

## Installation

### NPM

```bash
npm install ethcal-ui
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/ethcal-ui/dist/ethcal-ui.css">

<!-- JavaScript (UMD) -->
<script src="https://unpkg.com/ethcal-ui/dist/ethcal-ui.umd.js"></script>
```

## Usage

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/ethcal-ui/dist/ethcal-ui.css">
</head>
<body>
    <input type="text" id="dateInput" placeholder="Select date" readonly>
    
    <script type="module">
        import { EthiopianCalendarUI } from './node_modules/ethcal-ui/dist/ethcal-ui.esm.js';

        const calendar = new EthiopianCalendarUI({
            inputElement: document.getElementById('dateInput'),
            onSelect: (date) => {
                console.log('Ethiopian:', date.ethiopian);
                console.log('Gregorian:', date.gregorian);
            }
        });

        document.getElementById('dateInput').addEventListener('click', () => {
            calendar.show();
        });
    </script>
</body>
</html>
```

### React

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { EthiopianCalendarUI } from 'ethcal-ui';

const EthiopianDatePicker = ({ onSelect }) => {
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    calendarRef.current = new EthiopianCalendarUI({
      inputElement: inputRef.current,
      onSelect: (date) => {
        const eth = date.ethiopian;
        setValue(`${eth.day}/${eth.month}/${eth.year}`);
        onSelect?.(date);
      }
    });

    return () => calendarRef.current?.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder="Select date"
      onClick={() => calendarRef.current?.show()}
      readOnly
    />
  );
};
```

### Vue 3

```vue
<template>
  <input
    ref="inputRef"
    type="text"
    :value="selectedDate"
    placeholder="Select date"
    @click="showCalendar"
    readonly
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EthiopianCalendarUI } from 'ethcal-ui';

const inputRef = ref(null);
const selectedDate = ref('');
let calendar = null;

const emit = defineEmits(['select']);

onMounted(() => {
  calendar = new EthiopianCalendarUI({
    inputElement: inputRef.value,
    onSelect: (date) => {
      const eth = date.ethiopian;
      selectedDate.value = `${eth.day}/${eth.month}/${eth.year}`;
      emit('select', date);
    }
  });
});

onUnmounted(() => {
  calendar?.destroy();
});

const showCalendar = () => {
  calendar?.show();
};
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { EthiopianCalendarUI } from 'ethcal-ui';

@Component({
  selector: 'app-ethiopian-date-picker',
  template: `
    <input
      #dateInput
      type="text"
      [value]="selectedDate"
      placeholder="Select date"
      (click)="showCalendar()"
      readonly
    />
  `
})
export class EthiopianDatePickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dateInput') dateInput!: ElementRef;
  
  selectedDate = '';
  private calendar: any;

  ngAfterViewInit() {
    this.calendar = new EthiopianCalendarUI({
      inputElement: this.dateInput.nativeElement,
      onSelect: (date: any) => {
        const eth = date.ethiopian;
        this.selectedDate = `${eth.day}/${eth.month}/${eth.year}`;
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
```

### PHP

```php
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/ethcal-ui/dist/ethcal-ui.css">
</head>
<body>
    <form method="POST">
        <input type="text" 
               id="ethiopian_date" 
               name="ethiopian_date" 
               value="<?php echo htmlspecialchars($_POST['ethiopian_date'] ?? ''); ?>"
               readonly>
        <input type="hidden" 
               id="gregorian_date" 
               name="gregorian_date" 
               value="<?php echo htmlspecialchars($_POST['gregorian_date'] ?? ''); ?>">
        <button type="submit">Submit</button>
    </form>

    <script type="module">
        import { EthiopianCalendarUI } from './node_modules/ethcal-ui/dist/ethcal-ui.esm.js';

        const calendar = new EthiopianCalendarUI({
            inputElement: document.getElementById('ethiopian_date'),
            onSelect: (date) => {
                const eth = date.ethiopian;
                document.getElementById('ethiopian_date').value = 
                    `${eth.day}/${eth.month}/${eth.year}`;
                document.getElementById('gregorian_date').value = 
                    date.gregorian.toISOString().split('T')[0];
            }
        });

        document.getElementById('ethiopian_date').addEventListener('click', () => {
            calendar.show();
        });
    </script>
</body>
</html>
```

## API Reference

### EthiopianCalendarUI

Constructor options:

```javascript
new EthiopianCalendarUI({
  inputElement: HTMLElement,  // Optional: input element to bind to
  initialDate: Date,          // Optional: initial date (default: today)
  onSelect: function(date)    // Optional: callback when date is selected
})
```

Methods:

- `show()` - Show the calendar popup
- `hide()` - Hide the calendar popup
- `destroy()` - Remove the calendar from DOM
- `setDate(date)` - Set the current displayed date
- `getSelectedDate()` - Get the currently selected date

### EthiopianCalendar

Utility class for date conversion:

```javascript
import { EthiopianCalendar } from 'ethcal-ui';

const calendar = new EthiopianCalendar();

// Convert Gregorian to Ethiopian
const ethDate = calendar.toEthiopian(new Date());
// Returns: { year: 2017, month: 1, day: 20 }

// Convert Ethiopian to Gregorian
const gregDate = calendar.toGregorian(2017, 1, 20);
// Returns: Date object

// Get month name
const monthName = calendar.getMonthName(1); // "Meskerem"

// Check if leap year
const isLeap = calendar.isLeapYear(2017); // true/false

// Get current Ethiopian date
const today = calendar.now();
```

### Ethiopian Months

1. Meskerem (መስከረም) - 30 days
2. Tikimt (ጥቅምት) - 30 days
3. Hidar (ኅዳር) - 30 days
4. Tahsas (ታኅሣሥ) - 30 days
5. Tir (ጥር) - 30 days
6. Yekatit (የካቲት) - 30 days
7. Megabit (መጋቢት) - 30 days
8. Miazia (ሚያዝያ) - 30 days
9. Ginbot (ግንቦት) - 30 days
10. Sene (ሰኔ) - 30 days
11. Hamle (ሐምሌ) - 30 days
12. Nehase (ነሐሴ) - 30 days
13. Pagume (ጳጉሜን) - 5 or 6 days

## Examples

Check the `examples` folder for complete working examples:

- `examples/vanilla.html` - Vanilla JavaScript examples
- `examples/react-component.jsx` - React component
- `examples/php-form.php` - PHP form integration

## Styling

The calendar comes with default styling, but you can customize it by overriding CSS classes:

```css
.ethcal-popup { /* Main popup container */ }
.ethcal-header { /* Header with navigation */ }
.ethcal-weekdays { /* Weekday names */ }
.ethcal-days { /* Days grid */ }
.ethcal-day { /* Individual day cell */ }
.ethcal-today-highlight { /* Today's date */ }
.ethcal-selected { /* Selected date */ }
.ethcal-footer { /* Footer with buttons */ }
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Chrome for Android (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Based on the Ethiopian calendar system, which has 13 months with 12 months of 30 days and a 13th month (Pagume) of 5 or 6 days.

# Merged Calendar View - Usage Guide

## Overview

The merged calendar view displays both Ethiopian and Gregorian dates in a single calendar grid, eliminating the need for side-by-side calendars. You can choose which calendar is primary (takes most of the space) and which is secondary (shows in the corner).

## Usage

### Basic Usage - Ethiopian as Primary

```javascript
import { EthiopianCalendarUI } from 'ethcal-ui';

const calendar = new EthiopianCalendarUI({
    inputElement: document.getElementById('dateInput'),
    mergedView: true,  // Enable merged view
    primaryCalendar: 'ethiopian',  // Ethiopian dates as primary
    onSelect: (date) => {
        console.log('Ethiopian:', date.ethiopian);
        console.log('Gregorian:', date.gregorian);
    }
});

document.getElementById('dateInput').addEventListener('click', () => {
    calendar.show();
});
```

### Gregorian as Primary

```javascript
const calendar = new EthiopianCalendarUI({
    inputElement: document.getElementById('dateInput'),
    mergedView: true,
    primaryCalendar: 'gregorian',  // Gregorian dates as primary
    onSelect: (date) => {
        console.log('Selected:', date);
    }
});
```

### With Toggle Feature

When `mergedView` is enabled, users can toggle between Ethiopian and Gregorian as primary using the "Ethiopian Primary" checkbox in the calendar UI.

```javascript
const calendar = new EthiopianCalendarUI({
    mergedView: true,
    primaryCalendar: 'ethiopian',  // Initial primary calendar
    // Users can toggle using the checkbox
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mergedView` | boolean | `false` | Enable merged calendar view |
| `primaryCalendar` | string | `'ethiopian'` | Primary calendar: `'ethiopian'` or `'gregorian'` |
| `useAmharic` | boolean | `true` | Use Amharic for month and day names |
| `useEthiopicNumbers` | boolean | `false` | Use Ethiopic numerals for dates |
| `onSelect` | function | `null` | Callback when a date is selected |
| `inputElement` | HTMLElement | `null` | Input element to attach calendar to |

## Visual Layout

### Primary Calendar (Ethiopian)
- Large, bold numbers in the center of each cell
- Ethiopian dates prominently displayed
- Gregorian dates shown in small text in the top-right corner

### Primary Calendar (Gregorian)
- Large, bold Gregorian numbers in the center
- Ethiopian dates shown in small text in the top-right corner

## Examples

See `examples/merged-calendar.html` for complete working examples demonstrating:
1. Ethiopian as primary
2. Gregorian as primary  
3. Programmatic calendar with toggle functionality

## Comparison with Side-by-Side View

### Traditional Side-by-Side View
```javascript
const calendar = new EthiopianCalendarUI({
    showGregorian: true,  // Shows two separate calendars
    mergedView: false     // Default
});
```

### New Merged View
```javascript
const calendar = new EthiopianCalendarUI({
    mergedView: true,           // Single calendar with both dates
    primaryCalendar: 'ethiopian'
});
```

## Benefits

1. **Space Efficient**: Single calendar instead of two side-by-side
2. **Clear Primary/Secondary**: Easy to see which calendar system you're working with
3. **Quick Reference**: See both dates for any day without switching views
4. **Toggle Feature**: Switch primary calendar on-the-fly
5. **Better Mobile Experience**: Single column layout works better on small screens

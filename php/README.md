# Ethiopian Calendar PHP Helper

This directory contains the PHP helper class for Ethiopian calendar date conversion.

## Installation

### With Composer (Recommended)

The PHP helper uses the well-tested [andegna/calender](https://github.com/andegna/calender) package for accurate Ethiopian calendar calculations.

```bash
composer require bentade/ethcal-ui
```

Or if you're using this as part of the ethcal-ui package:

```bash
cd /path/to/ethcal-ui
composer install
```

### Without Composer

The class includes a fallback implementation that works without composer dependencies. Simply include the file:

```php
require_once 'php/EthiopianCalendar.php';
```

Note: Using the composer installation provides more accurate calendar calculations through the andegna/calender package.

## Usage

```php
<?php
require_once 'vendor/autoload.php';
require_once 'vendor/bentade/ethcal-ui/php/EthiopianCalendar.php';

$calendar = new EthiopianCalendar();

// Get today's Ethiopian date
$today = $calendar->now();
echo $calendar->format($today, 'd M y'); // e.g., "20 Meskerem 2018"

// Convert Gregorian to Ethiopian
$ethDate = $calendar->toEthiopian('2024-09-11');
echo $calendar->format($ethDate, 'd M y'); // "01 Meskerem 2017"

// Convert Ethiopian to Gregorian
$gregDate = $calendar->toGregorian(2017, 1, 20);
echo $gregDate->format('Y-m-d'); // "2024-09-30"
```

## API

### Methods

- `now()` - Get current Ethiopian date
- `toEthiopian($gregorianDate)` - Convert Gregorian date to Ethiopian
- `toGregorian($year, $month, $day)` - Convert Ethiopian date to Gregorian
- `format($ethDate, $format)` - Format Ethiopian date
- `getMonthName($month)` - Get month name
- `getDayName($dayOfWeek)` - Get day name
- `isLeapYear($year)` - Check if Ethiopian year is leap year
- `getDaysInMonth($year, $month)` - Get number of days in month

### Format Patterns

- `d` - Day with leading zero (01-30)
- `m` - Month with leading zero (01-13)
- `y` - Year (e.g., 2017)
- `M` - Month name (e.g., "Meskerem")

## Ethiopian Calendar

The Ethiopian calendar has:
- 12 months of 30 days each
- A 13th month (Pagume) with 5 days (6 in leap years)
- New year on September 11 (or 12 in leap years before the Gregorian new year)
- A leap year every 4 years (when the year number mod 4 equals 3)

## Months

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

## Credits

This implementation uses the [andegna/calender](https://github.com/andegna/calender) package for accurate Ethiopian calendar calculations.

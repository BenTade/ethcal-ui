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

**Note:** The andegna/calender package is **required** for this helper class to work. It is no longer optional.

## Usage

### Basic Usage

```php
<?php
require_once 'vendor/autoload.php';
require_once 'vendor/bentade/ethcal-ui/php/EthiopianCalendar.php';

$calendar = new EthiopianCalendar();

// Get today's Ethiopian date (as array)
$today = $calendar->now();
echo $calendar->format($today, 'd M y'); // e.g., "20 Meskerem 2018"

// Convert Gregorian to Ethiopian
$ethDate = $calendar->toEthiopian('2024-09-11');
echo $calendar->format($ethDate, 'd M y'); // "01 Meskerem 2017"

// Convert Ethiopian to Gregorian
$gregDate = $calendar->toGregorian(2017, 1, 20);
echo $gregDate->format('Y-m-d'); // "2024-09-30"
```

### Advanced Usage (Full andegna/calender functionality)

The helper now exposes all the functionality from the andegna/calender package:

```php
<?php
require_once 'vendor/autoload.php';
require_once 'vendor/bentade/ethcal-ui/php/EthiopianCalendar.php';

$calendar = new EthiopianCalendar();

// Get today as Andegna\DateTime object for full functionality
$todayDT = $calendar->nowDateTime();
echo $todayDT->format(\Andegna\Constants::DATE_ETHIOPIAN); // "ዓርብ፣ ግንቦት 04 ቀን..."

// Format with Amharic using andegna format patterns
$ethDate = $calendar->toEthiopian('2024-09-11');
echo $calendar->formatEthiopian($ethDate, \Andegna\Constants::DATE_GEEZ); // Geez numerals

// Validate dates
$isValid = $calendar->isValidDate(2017, 13, 6); // true
$isLeap = $calendar->isLeapYear(2015); // true

// Get Easter date
$easter = $calendar->getEasterAsArray(2017);
echo "Easter: " . $calendar->format($easter, 'd M y');

// Manipulate dates
$modified = $calendar->modify($today, '+1 month');
echo $calendar->format($modified, 'd M y');

// Add/subtract intervals
$nextWeek = $calendar->add($today, new DateInterval('P7D'));
$lastMonth = $calendar->sub($today, new DateInterval('P1M'));

// Get day of year and day of week
$dayOfYear = $calendar->getDayOfYear(2017, 1, 1);
$dayOfWeek = $calendar->getDayOfWeek(2017, 1, 1); // 1-7 (Mon-Sun)

// Create from timestamp
$fromTs = $calendar->fromTimestamp(time());

// Create Andegna\DateTime directly for maximum control
$ethiopianDT = $calendar->createEthiopianDateTime(2017, 1, 20, 12, 30, 0);
echo $ethiopianDT->format('Y-m-d H:i:s'); // Full datetime formatting
```

## API

### Core Conversion Methods

- `now($timezone = null)` - Get current Ethiopian date as array
- `nowDateTime($timezone = null)` - Get current Ethiopian date as Andegna\DateTime object
- `toEthiopian($gregorianDate)` - Convert Gregorian date to Ethiopian array
- `toEthiopianDateTime($gregorianDate)` - Convert Gregorian to Andegna\DateTime object
- `toGregorian($year, $month, $day, $hour = 0, $minute = 0, $second = 0, $timezone = null)` - Convert Ethiopian to Gregorian DateTime
- `fromTimestamp($timestamp, $timezone = null)` - Create Ethiopian date from Unix timestamp as array
- `fromTimestampDateTime($timestamp, $timezone = null)` - Create from timestamp as Andegna\DateTime object

### Formatting Methods

- `format($ethDate, $format)` - Format Ethiopian date (simple format for compatibility)
- `formatEthiopian($ethDate, $format, $timezone = null)` - Format using andegna/calender patterns (supports Amharic)
- `getMonthName($month)` - Get month name in English
- `getDayName($dayOfWeek)` - Get day name in English

### Validation Methods

- `isLeapYear($year)` - Check if Ethiopian year is leap year
- `isValidDate($year, $month, $day)` - Validate an Ethiopian date

### Date Information Methods

- `getDaysInMonth($year, $month)` - Get number of days in month
- `getDayOfYear($year, $month, $day)` - Get day of year (1-366)
- `getDayOfWeek($year, $month, $day)` - Get day of week (1-7, Monday-Sunday)

### Date Manipulation Methods

- `modify($ethDate, $modification, $timezone = null)` - Modify date with string like '+1 day'
- `add($ethDate, $interval, $timezone = null)` - Add DateInterval to date
- `sub($ethDate, $interval, $timezone = null)` - Subtract DateInterval from date

### Holiday Methods

- `getEaster($year)` - Get Easter date as Andegna\DateTime object
- `getEasterAsArray($year)` - Get Easter date as array

### Factory Methods

- `createEthiopianDateTime($year, $month, $day, $hour = 0, $minute = 0, $second = 0, $timezone = null)` - Create Andegna\DateTime object

### Simple Format Patterns

For `format()` method:
- `d` - Day with leading zero (01-30)
- `m` - Month with leading zero (01-13)
- `y` - Year (e.g., 2017)
- `M` - Month name (e.g., "Meskerem")

### Andegna Format Patterns

For `formatEthiopian()` method, all PHP date format characters are supported, plus:
- `x` - Orthodox day name (e.g., ልደታ, ሚካኤል)
- `X` - Orthodox year name (ማቴዎስ, ማርቆስ, ሉቃስ, ዮሐንስ)
- `E` - Era in Amharic (ዓ/ዓ or ዓ/ም)
- `K` - Year in Geez numbers (፳፻፱)
- `V` - Day in Geez numbers (፪)

### Andegna Constants

Use these with `formatEthiopian()`:
- `\Andegna\Constants::DATE_ETHIOPIAN` - Ethiopian format with ASCII numbers
- `\Andegna\Constants::DATE_ETHIOPIAN_ORTHODOX` - Ethiopian with orthodox names
- `\Andegna\Constants::DATE_GEEZ` - Geez numbers
- `\Andegna\Constants::DATE_GEEZ_ORTHODOX` - Geez with orthodox names

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

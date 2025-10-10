<?php
/**
 * Ethiopian Calendar PHP Helper
 * Converts between Gregorian and Ethiopian calendars
 * 
 * This is a companion class to the JavaScript UI component
 * for server-side date handling in PHP applications.
 * 
 * This implementation uses the andegna/calender package for accurate
 * Ethiopian calendar calculations and exposes all its functionalities.
 */

// Check if composer autoload exists
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

use Andegna\DateTime as AndegnaDateTime;
use Andegna\DateTimeFactory;
use Andegna\Validator\DateValidator;
use Andegna\Validator\LeapYearValidator;
use Andegna\Holiday\Easter;

class EthiopianCalendar {
    
    private $monthNames = [
        'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
        'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
    ];
    
    private $dayNames = ['Ehud', 'Segno', 'Maksegno', 'Erob', 'Hamus', 'Arb', 'Kidame'];

    /**
     * Convert Gregorian date to Ethiopian date
     * 
     * @param DateTime|string $gregorianDate DateTime object or date string
     * @return array Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function toEthiopian($gregorianDate) {
        if (is_string($gregorianDate)) {
            $gregorianDate = new DateTime($gregorianDate);
        }
        
        $ethiopic = new AndegnaDateTime($gregorianDate);
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Convert Gregorian date to Ethiopian date and return Andegna\DateTime object
     * This exposes the full functionality of andegna/calender
     * 
     * @param DateTime|string $gregorianDate DateTime object or date string
     * @return AndegnaDateTime Ethiopian DateTime object with full andegna functionality
     */
    public function toEthiopianDateTime($gregorianDate) {
        if (is_string($gregorianDate)) {
            $gregorianDate = new DateTime($gregorianDate);
        }
        
        return new AndegnaDateTime($gregorianDate);
    }

    /**
     * Convert Ethiopian date to Gregorian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @param int $hour Hour (0-23), default 0
     * @param int $minute Minute (0-59), default 0
     * @param int $second Second (0-59), default 0
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return DateTime Gregorian DateTime object
     * @throws Exception If the date is invalid
     */
    public function toGregorian($year, $month, $day, $hour = 0, $minute = 0, $second = 0, $timezone = null) {
        $ethiopic = DateTimeFactory::of($year, $month, $day, $hour, $minute, $second, $timezone);
        return $ethiopic->toGregorian();
    }

    /**
     * Get the number of days in an Ethiopian month
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @return int Number of days
     */
    public function getDaysInMonth($year, $month) {
        $ethiopic = DateTimeFactory::of($year, $month, 1);
        return $ethiopic->getDaysInMonth();
    }

    /**
     * Check if an Ethiopian year is a leap year
     * 
     * @param int $year Ethiopian year
     * @return bool True if leap year
     */
    public function isLeapYear($year) {
        return (new LeapYearValidator($year))->isValid();
    }
    
    /**
     * Validate an Ethiopian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return bool True if valid date
     */
    public function isValidDate($year, $month, $day) {
        return (new DateValidator($day, $month, $year))->isValid();
    }

    /**
     * Get month name
     * 
     * @param int $month Ethiopian month (1-13)
     * @return string Month name
     */
    public function getMonthName($month) {
        return $this->monthNames[$month - 1] ?? '';
    }

    /**
     * Get day name
     * 
     * @param int $dayOfWeek Day of week (0-6, 0 = Sunday)
     * @return string Day name
     */
    public function getDayName($dayOfWeek) {
        return $this->dayNames[$dayOfWeek] ?? '';
    }

    /**
     * Get current Ethiopian date
     * 
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return array Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function now($timezone = null) {
        $ethiopic = DateTimeFactory::now($timezone);
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Get current Ethiopian date as Andegna\DateTime object
     * This exposes the full functionality of andegna/calender
     * 
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return AndegnaDateTime Ethiopian DateTime object with full andegna functionality
     */
    public function nowDateTime($timezone = null) {
        return DateTimeFactory::now($timezone);
    }
    
    /**
     * Create Ethiopian date from timestamp
     * 
     * @param int $timestamp Unix timestamp
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return array Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function fromTimestamp($timestamp, $timezone = null) {
        $ethiopic = DateTimeFactory::fromTimestamp($timestamp, $timezone);
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Create Ethiopian date from timestamp as Andegna\DateTime object
     * This exposes the full functionality of andegna/calender
     * 
     * @param int $timestamp Unix timestamp
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return AndegnaDateTime Ethiopian DateTime object with full andegna functionality
     */
    public function fromTimestampDateTime($timestamp, $timezone = null) {
        return DateTimeFactory::fromTimestamp($timestamp, $timezone);
    }

    /**
     * Format Ethiopian date as string (simple format for compatibility)
     * 
     * @param array $ethDate Ethiopian date array
     * @param string $format Format string (supports: d, m, y, M for month name)
     * @return string Formatted date
     */
    public function format($ethDate, $format = 'd/m/y') {
        // Use unique placeholders to avoid character conflicts
        $replacements = [
            'y' => $ethDate['year'],
            'M' => $this->getMonthName($ethDate['month']),
            'm' => str_pad($ethDate['month'], 2, '0', STR_PAD_LEFT),
            'd' => str_pad($ethDate['day'], 2, '0', STR_PAD_LEFT),
        ];
        
        // Create unique temporary placeholders
        $temp = $format;
        $temp = str_replace('M', '<<<MONTH_NAME>>>', $temp);
        $temp = str_replace('y', '<<<YEAR>>>', $temp);
        $temp = str_replace('m', '<<<MONTH_NUM>>>', $temp);
        $temp = str_replace('d', '<<<DAY>>>', $temp);
        
        // Replace with actual values
        $temp = str_replace('<<<MONTH_NAME>>>', $replacements['M'], $temp);
        $temp = str_replace('<<<YEAR>>>', $replacements['y'], $temp);
        $temp = str_replace('<<<MONTH_NUM>>>', $replacements['m'], $temp);
        $temp = str_replace('<<<DAY>>>', $replacements['d'], $temp);
        
        return $temp;
    }
    
    /**
     * Format Ethiopian date using andegna/calender format patterns
     * This supports all format patterns from andegna including Amharic formatting
     * 
     * @param array|AndegnaDateTime $ethDate Ethiopian date array or AndegnaDateTime object
     * @param string $format PHP date format string (see andegna/calender documentation)
     * @param DateTimeZone|null $timezone Timezone for the date
     * @return string Formatted date
     */
    public function formatEthiopian($ethDate, $format, $timezone = null) {
        if (is_array($ethDate)) {
            $ethiopic = DateTimeFactory::of(
                $ethDate['year'], 
                $ethDate['month'], 
                $ethDate['day'],
                isset($ethDate['hour']) ? $ethDate['hour'] : 0,
                isset($ethDate['minute']) ? $ethDate['minute'] : 0,
                isset($ethDate['second']) ? $ethDate['second'] : 0,
                $timezone
            );
        } else {
            $ethiopic = $ethDate;
        }
        
        return $ethiopic->format($format);
    }
    
    /**
     * Create Ethiopian DateTime object from date components
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @param int $hour Hour (0-23), default 0
     * @param int $minute Minute (0-59), default 0
     * @param int $second Second (0-59), default 0
     * @param DateTimeZone|null $timezone Timezone, default system timezone
     * @return AndegnaDateTime Ethiopian DateTime object with full andegna functionality
     */
    public function createEthiopianDateTime($year, $month, $day, $hour = 0, $minute = 0, $second = 0, $timezone = null) {
        return DateTimeFactory::of($year, $month, $day, $hour, $minute, $second, $timezone);
    }
    
    /**
     * Get Easter date for a given Ethiopian year
     * 
     * @param int $year Ethiopian year
     * @return AndegnaDateTime Easter date
     */
    public function getEaster($year) {
        $easter = new Easter();
        return $easter->get($year);
    }
    
    /**
     * Get Easter date as array for a given Ethiopian year
     * 
     * @param int $year Ethiopian year
     * @return array Easter date ['year' => int, 'month' => int, 'day' => int]
     */
    public function getEasterAsArray($year) {
        $easter = $this->getEaster($year);
        return [
            'year' => $easter->getYear(),
            'month' => $easter->getMonth(),
            'day' => $easter->getDay()
        ];
    }
    
    /**
     * Manipulate an Ethiopian date
     * 
     * @param array|AndegnaDateTime $ethDate Ethiopian date array or AndegnaDateTime object
     * @param string $modification Modification string (e.g., '+1 day', '-3 months')
     * @param DateTimeZone|null $timezone Timezone for the date
     * @return array Modified Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function modify($ethDate, $modification, $timezone = null) {
        if (is_array($ethDate)) {
            $ethiopic = DateTimeFactory::of(
                $ethDate['year'], 
                $ethDate['month'], 
                $ethDate['day'],
                isset($ethDate['hour']) ? $ethDate['hour'] : 0,
                isset($ethDate['minute']) ? $ethDate['minute'] : 0,
                isset($ethDate['second']) ? $ethDate['second'] : 0,
                $timezone
            );
        } else {
            $ethiopic = clone $ethDate;
        }
        
        $ethiopic->modify($modification);
        
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Add interval to an Ethiopian date
     * 
     * @param array|AndegnaDateTime $ethDate Ethiopian date array or AndegnaDateTime object
     * @param DateInterval $interval Date interval to add
     * @param DateTimeZone|null $timezone Timezone for the date
     * @return array Modified Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function add($ethDate, $interval, $timezone = null) {
        if (is_array($ethDate)) {
            $ethiopic = DateTimeFactory::of(
                $ethDate['year'], 
                $ethDate['month'], 
                $ethDate['day'],
                isset($ethDate['hour']) ? $ethDate['hour'] : 0,
                isset($ethDate['minute']) ? $ethDate['minute'] : 0,
                isset($ethDate['second']) ? $ethDate['second'] : 0,
                $timezone
            );
        } else {
            $ethiopic = clone $ethDate;
        }
        
        $ethiopic->add($interval);
        
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Subtract interval from an Ethiopian date
     * 
     * @param array|AndegnaDateTime $ethDate Ethiopian date array or AndegnaDateTime object
     * @param DateInterval $interval Date interval to subtract
     * @param DateTimeZone|null $timezone Timezone for the date
     * @return array Modified Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function sub($ethDate, $interval, $timezone = null) {
        if (is_array($ethDate)) {
            $ethiopic = DateTimeFactory::of(
                $ethDate['year'], 
                $ethDate['month'], 
                $ethDate['day'],
                isset($ethDate['hour']) ? $ethDate['hour'] : 0,
                isset($ethDate['minute']) ? $ethDate['minute'] : 0,
                isset($ethDate['second']) ? $ethDate['second'] : 0,
                $timezone
            );
        } else {
            $ethiopic = clone $ethDate;
        }
        
        $ethiopic->sub($interval);
        
        return [
            'year' => $ethiopic->getYear(),
            'month' => $ethiopic->getMonth(),
            'day' => $ethiopic->getDay()
        ];
    }
    
    /**
     * Get day of year for an Ethiopian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return int Day of year (1-366)
     */
    public function getDayOfYear($year, $month, $day) {
        $ethiopic = DateTimeFactory::of($year, $month, $day);
        return $ethiopic->getDayOfYear();
    }
    
    /**
     * Get day of week for an Ethiopian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return int Day of week (1 for Monday through 7 for Sunday)
     */
    public function getDayOfWeek($year, $month, $day) {
        $ethiopic = DateTimeFactory::of($year, $month, $day);
        return $ethiopic->getDayOfWeek();
    }
}

// Example usage:
/*
$calendar = new EthiopianCalendar();

// Get today's Ethiopian date (as array)
$today = $calendar->now();
echo "Today: " . $calendar->format($today, 'd M y') . "\n";

// Get today's Ethiopian date (as Andegna\DateTime object with full functionality)
$todayDT = $calendar->nowDateTime();
echo "Today (Amharic): " . $todayDT->format(\Andegna\Constants::DATE_ETHIOPIAN) . "\n";

// Convert specific Gregorian date to Ethiopian
$ethDate = $calendar->toEthiopian('2025-09-30');
echo "2025-09-30 in Ethiopian: " . $calendar->format($ethDate, 'd M y') . "\n";

// Convert Ethiopian date to Gregorian
$gregDate = $calendar->toGregorian(2017, 1, 20);
echo "20/1/2017 in Gregorian: " . $gregDate->format('Y-m-d') . "\n";

// Use andegna format patterns for Amharic output
$ethDT = $calendar->toEthiopianDateTime('2024-09-11');
echo "Formatted (Amharic): " . $calendar->formatEthiopian($ethDate, \Andegna\Constants::DATE_ETHIOPIAN) . "\n";

// Validate Ethiopian date
$isValid = $calendar->isValidDate(2017, 13, 6);
echo "Is 6/13/2017 valid? " . ($isValid ? 'Yes' : 'No') . "\n";

// Check leap year
$isLeap = $calendar->isLeapYear(2015);
echo "Is 2015 a leap year? " . ($isLeap ? 'Yes' : 'No') . "\n";

// Get Easter date
$easter = $calendar->getEasterAsArray(2017);
echo "Easter 2017: " . $calendar->format($easter, 'd M y') . "\n";

// Manipulate dates
$modified = $calendar->modify($today, '+1 month');
echo "Next month: " . $calendar->format($modified, 'd M y') . "\n";

// Get day of year
$dayOfYear = $calendar->getDayOfYear(2017, 1, 1);
echo "Day of year for 1/1/2017: " . $dayOfYear . "\n";

// Create from timestamp
$fromTs = $calendar->fromTimestamp(time());
echo "From timestamp: " . $calendar->format($fromTs, 'd M y') . "\n";
*/

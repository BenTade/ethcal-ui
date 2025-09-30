<?php
/**
 * Ethiopian Calendar PHP Helper
 * Converts between Gregorian and Ethiopian calendars
 * 
 * This is a companion class to the JavaScript UI component
 * for server-side date handling in PHP applications.
 */

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
        
        $year = (int)$gregorianDate->format('Y');
        $month = (int)$gregorianDate->format('m');
        $day = (int)$gregorianDate->format('d');
        
        // JDN (Julian Day Number) calculation
        $a = floor((14 - $month) / 12);
        $y = $year + 4800 - $a;
        $m = $month + 12 * $a - 3;
        
        $jdn = $day + floor((153 * $m + 2) / 5) + 365 * $y + 
               floor($y / 4) - floor($y / 100) + 
               floor($y / 400) - 32045;
        
        // Convert JDN to Ethiopian
        $r = ($jdn - 1723856) % 1461;
        $n = ($r % 365) + 365 * floor($r / 1460);
        
        $ethYear = floor(($jdn - 1723856) / 1461) + 1;
        $ethMonth = floor($n / 30) + 1;
        $ethDay = ($n % 30) + 1;
        
        return [
            'year' => $ethYear,
            'month' => $ethMonth,
            'day' => $ethDay
        ];
    }

    /**
     * Convert Ethiopian date to Gregorian date
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return DateTime Gregorian DateTime object
     */
    public function toGregorian($year, $month, $day) {
        // Calculate JDN from Ethiopian date
        $jdn = ($year - 1) * 1461 / 4 + ($month - 1) * 30 + $day + 1723856;
        
        // Convert JDN to Gregorian
        $a = $jdn + 32044;
        $b = floor((4 * $a + 3) / 146097);
        $c = $a - floor(146097 * $b / 4);
        $d = floor((4 * $c + 3) / 1461);
        $e = $c - floor(1461 * $d / 4);
        $m = floor((5 * $e + 2) / 153);
        
        $gregDay = $e - floor((153 * $m + 2) / 5) + 1;
        $gregMonth = $m + 3 - 12 * floor($m / 10);
        $gregYear = 100 * $b + $d - 4800 + floor($m / 10);
        
        return new DateTime(sprintf('%04d-%02d-%02d', $gregYear, $gregMonth, $gregDay));
    }

    /**
     * Get the number of days in an Ethiopian month
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @return int Number of days
     */
    public function getDaysInMonth($year, $month) {
        if ($month < 13) {
            return 30;
        }
        // Pagume has 5 days in common years, 6 in leap years
        return $this->isLeapYear($year) ? 6 : 5;
    }

    /**
     * Check if an Ethiopian year is a leap year
     * 
     * @param int $year Ethiopian year
     * @return bool True if leap year
     */
    public function isLeapYear($year) {
        return ($year % 4) === 3;
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
     * @return array Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    public function now() {
        return $this->toEthiopian(new DateTime());
    }

    /**
     * Format Ethiopian date as string
     * 
     * @param array $ethDate Ethiopian date array
     * @param string $format Format string (supports: d, m, y, M for month name)
     * @return string Formatted date
     */
    public function format($ethDate, $format = 'd/m/y') {
        $output = $format;
        $output = str_replace('d', $ethDate['day'], $output);
        $output = str_replace('M', $this->getMonthName($ethDate['month']), $output);
        $output = str_replace('m', $ethDate['month'], $output);
        $output = str_replace('y', $ethDate['year'], $output);
        return $output;
    }
}

// Example usage:
/*
$calendar = new EthiopianCalendar();

// Get today's Ethiopian date
$today = $calendar->now();
echo "Today: " . $calendar->format($today, 'd M y') . "\n";

// Convert specific Gregorian date to Ethiopian
$ethDate = $calendar->toEthiopian('2025-09-30');
echo "2025-09-30 in Ethiopian: " . $calendar->format($ethDate, 'd M y') . "\n";

// Convert Ethiopian date to Gregorian
$gregDate = $calendar->toGregorian(2017, 1, 20);
echo "20/1/2017 in Gregorian: " . $gregDate->format('Y-m-d') . "\n";
*/

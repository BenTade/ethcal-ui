<?php
/**
 * Ethiopian Calendar PHP Helper
 * Converts between Gregorian and Ethiopian calendars
 * 
 * This is a companion class to the JavaScript UI component
 * for server-side date handling in PHP applications.
 * 
 * This implementation uses the andegna/calender package for accurate
 * Ethiopian calendar calculations.
 */

// Check if composer autoload exists
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

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
        
        // Use andegna/calender for conversion if available
        if (class_exists('Andegna\DateTime')) {
            $ethiopic = new Andegna\DateTime($gregorianDate);
            return [
                'year' => $ethiopic->getYear(),
                'month' => $ethiopic->getMonth(),
                'day' => $ethiopic->getDay()
            ];
        }
        
        // Fallback to original implementation if andegna/calender is not available
        return $this->toEthiopianFallback($gregorianDate);
    }

    /**
     * Fallback conversion method (original implementation)
     * 
     * @param DateTime $gregorianDate DateTime object
     * @return array Ethiopian date ['year' => int, 'month' => int, 'day' => int]
     */
    private function toEthiopianFallback($gregorianDate) {
        $year = (int)$gregorianDate->format('Y');
        $month = (int)$gregorianDate->format('m');
        $date = (int)$gregorianDate->format('d');
        
        // Validate input
        if ($month === 10 && $date >= 5 && $date <= 14 && $year === 1582) {
            throw new Exception('Invalid Date between 5-14 May 1582.');
        }
        
        // Number of days in gregorian months starting with January (index 1)
        $gregorianMonths = [0.0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Number of days in ethiopian months starting with January (index 1)
        $ethiopianMonths = [0.0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5, 30, 30, 30, 30];
        
        // if gregorian leap year, February has 29 days
        if (($year % 4 === 0 && $year % 100 !== 0) || $year % 400 === 0) {
            $gregorianMonths[2] = 29;
        }
        
        // September sees 8y difference
        $ethiopianYear = $year - 8;
        
        // if ethiopian leap year pagumain has 6 days
        if ($ethiopianYear % 4 === 3) {
            $ethiopianMonths[10] = 6;
        }
        
        // Helper function for Ethiopian new year day
        $newYearDay = floor(($year - 8) / 100) - floor(($year - 8) / 400) - 4;
        if ((($year - 8 - 1) % 4 === 3)) {
            $newYearDay += 1;
        }
        
        // calculate number of days up to that date
        $until = 0;
        for ($i = 1; $i < $month; $i++) {
            $until += $gregorianMonths[$i];
        }
        $until += $date;
        
        // update tahissas (december) to match january 1st
        $tahissas = ($ethiopianYear % 4) === 0 ? 26 : 25;
        
        // take into account the 1582 change
        if ($year < 1582) {
            $ethiopianMonths[1] = 0;
            $ethiopianMonths[2] = $tahissas;
        } else if ($until <= 277 && $year === 1582) {
            $ethiopianMonths[1] = 0;
            $ethiopianMonths[2] = $tahissas;
        } else {
            $tahissas = $newYearDay - 3;
            $ethiopianMonths[1] = $tahissas;
        }
        
        // calculate month and date incremently
        $ethiopianDate = 0;
        for ($m = 1; $m < count($ethiopianMonths); $m++) {
            if ($until <= $ethiopianMonths[$m]) {
                $ethiopianDate = ($m === 1 || $ethiopianMonths[$m] === 0) ? $until + (30 - $tahissas) : $until;
                break;
            } else {
                $until -= $ethiopianMonths[$m];
            }
        }
        
        // if m > 10, we're already on next Ethiopian year
        if ($m > 10) {
            $ethiopianYear += 1;
        }
        
        // Ethiopian months ordered according to Gregorian
        $order = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4];
        $ethiopianMonth = $order[$m];
        
        return [
            'year' => $ethiopianYear,
            'month' => $ethiopianMonth,
            'day' => $ethiopianDate
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
        // Use andegna/calender for conversion if available
        if (class_exists('Andegna\DateTimeFactory')) {
            try {
                $ethiopic = Andegna\DateTimeFactory::of($year, $month, $day);
                return $ethiopic->toGregorian();
            } catch (Exception $e) {
                // If andegna fails (e.g., invalid date), use fallback
                return $this->toGregorianFallback($year, $month, $day);
            }
        }
        
        // Fallback to original implementation if andegna/calender is not available
        return $this->toGregorianFallback($year, $month, $day);
    }

    /**
     * Fallback conversion method (original implementation)
     * 
     * @param int $year Ethiopian year
     * @param int $month Ethiopian month (1-13)
     * @param int $day Ethiopian day
     * @return DateTime Gregorian DateTime object
     */
    private function toGregorianFallback($year, $month, $day) {
        // Helper function for Ethiopian new year day
        $newYearDay = floor($year / 100) - floor($year / 400) - 4;
        if ((($year - 1) % 4 === 3)) {
            $newYearDay += 1;
        }
        
        // September (Ethiopian) sees 7y difference
        $gregorianYear = $year + 7;
        
        // Number of days in gregorian months
        // starting with September (index 1)
        // Index 0 is reserved for leap years switches.
        // Index 4 is December, the final month of the year.
        $gregorianMonths = [0.0, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31, 31, 30];
        
        // if next gregorian year is leap year, February has 29 days.
        $nextYear = $gregorianYear + 1;
        if (($nextYear % 4 === 0 && $nextYear % 100 !== 0) || $nextYear % 400 === 0) {
            $gregorianMonths[6] = 29;
        }
        
        // calculate number of days up to that date
        $until = (($month - 1) * 30.0) + $day;
        if ($until <= 37 && $year <= 1575) { // mysterious rule
            $until += 28;
            $gregorianMonths[0] = 31;
        } else {
            $until += $newYearDay - 1;
        }
        
        // if ethiopian year is leap year, paguemain has six days
        if (($year - 1) % 4 === 3) {
            $until += 1;
        }
        
        // calculate month and date incremently
        $m = 0;
        $gregorianDate = 0;
        for ($i = 0; $i < count($gregorianMonths); $i++) {
            if ($until <= $gregorianMonths[$i]) {
                $m = $i;
                $gregorianDate = $until;
                break;
            } else {
                $m = $i;
                $until -= $gregorianMonths[$i];
            }
        }
        
        // if m > 4, we're already on next Gregorian year
        if ($m > 4) {
            $gregorianYear += 1;
        }
        
        // Gregorian months ordered according to Ethiopian
        $order = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        $gregorianMonth = $order[$m];
        
        return new DateTime(sprintf('%04d-%02d-%02d', $gregorianYear, $gregorianMonth, $gregorianDate));
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

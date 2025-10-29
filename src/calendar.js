/**
 * Ethiopian Calendar Utility
 * Converts between Gregorian and Ethiopian calendars
 * Ethiopian calendar has 13 months (12 months of 30 days + 1 month of 5/6 days)
 * 
 * This class now uses the ethcal package for calendar calculations
 */

import { DateTime, MONTH_NAMES, DAY_NAMES_LONG, GEEZ_NUMBERS } from 'ethcal';

class EthiopianCalendar {
  constructor() {
    // Month names in English
    this.monthNames = [
      'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
      'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
    ];
    
    // Day names in English
    this.dayNames = ['Ehud', 'Segno', 'Maksegno', 'Erob', 'Hamus', 'Arb', 'Kidame'];

    // Day names in Amharic (from ethcal package, mapped to Sunday-first order)
    // ethcal DAY_NAMES_LONG: ['', 'ሰኞ' (Mon), 'ማክሰኞ' (Tue), 'ረቡዕ' (Wed), 'ሐሙስ' (Thu), 'ዓርብ' (Fri), 'ቅዳሜ' (Sat), 'እሑድ' (Sun)]
    // We need: [እሑድ (Sun), ሰኞ (Mon), ማክሰኞ (Tue), ረቡዕ (Wed), ሐሙስ (Thu), ዓርብ (Fri), ቅዳሜ (Sat)]
    this.dayNamesAmharic = [
      DAY_NAMES_LONG[7], // Sunday
      DAY_NAMES_LONG[1], // Monday
      DAY_NAMES_LONG[2], // Tuesday
      DAY_NAMES_LONG[3], // Wednesday
      DAY_NAMES_LONG[4], // Thursday
      DAY_NAMES_LONG[5], // Friday
      DAY_NAMES_LONG[6]  // Saturday
    ];
  }

  /**
   * Convert Gregorian date to Ethiopian date
   * @param {Date} gregorianDate - Gregorian date object
   * @returns {Object} Ethiopian date {year, month, day}
   */
  toEthiopian(gregorianDate) {
    const dt = new DateTime(gregorianDate);
    return {
      year: dt.getYear(),
      month: dt.getMonth(),
      day: dt.getDay()
    };
  }

  /**
   * Convert Ethiopian date to Gregorian date
   * @param {number} year - Ethiopian year
   * @param {number} month - Ethiopian month (1-13)
   * @param {number} day - Ethiopian day
   * @returns {Date} Gregorian date object
   */
  toGregorian(year, month, day) {
    const dt = DateTime.of(year, month, day);
    return dt.toGregorian();
  }

  /**
   * Get the number of days in an Ethiopian month
   * @param {number} year - Ethiopian year
   * @param {number} month - Ethiopian month (1-13)
   * @returns {number} Number of days
   */
  getDaysInMonth(year, month) {
    if (month < 13) {
      return 30;
    }
    // Pagume has 5 days in common years, 6 in leap years
    return this.isLeapYear(year) ? 6 : 5;
  }

  /**
   * Check if an Ethiopian year is a leap year
   * @param {number} year - Ethiopian year
   * @returns {boolean} True if leap year
   */
  isLeapYear(year) {
    // Ethiopian leap year rule: (year + 1) % 4 == 0
    return ((year + 1) % 4) === 0;
  }

  /**
   * Get the day of week for an Ethiopian date
   * @param {number} year - Ethiopian year
   * @param {number} month - Ethiopian month
   * @param {number} day - Ethiopian day
   * @returns {number} Day of week (0-6, 0 = Sunday)
   */
  getDayOfWeek(year, month, day) {
    const gregDate = this.toGregorian(year, month, day);
    return gregDate.getDay();
  }

  /**
   * Get month name
   * @param {number} month - Ethiopian month (1-13)
   * @param {boolean} useAmharic - Use Amharic names
   * @returns {string} Month name
   */
  getMonthName(month, useAmharic = false) {
    if (useAmharic) {
      // MONTH_NAMES from ethcal is 1-indexed, so we can use month directly
      return MONTH_NAMES[month] || '';
    }
    // English names are 0-indexed
    return this.monthNames[month - 1] || '';
  }

  /**
   * Get day name
   * @param {number} dayOfWeek - Day of week (0-6)
   * @param {boolean} useAmharic - Use Amharic names
   * @returns {string} Day name
   */
  getDayName(dayOfWeek, useAmharic = false) {
    const names = useAmharic ? this.dayNamesAmharic : this.dayNames;
    return names[dayOfWeek] || '';
  }

  /**
   * Convert Arabic numerals to Ethiopic numerals
   * @param {number} num - Number to convert
   * @returns {string} Ethiopic numeral representation
   */
  toEthiopicNumeral(num) {
    if (num === 0) return '0';
    
    // Use GEEZ_NUMBERS from ethcal for 1-30
    if (num >= 1 && num <= 30) {
      return GEEZ_NUMBERS[num];
    }
    
    // For numbers > 30, use the fallback logic
    const ethiopicNumerals = {
      1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭',
      6: '፮', 7: '፯', 8: '፰', 9: '፱', 10: '፲',
      20: '፳', 30: '፴', 40: '፵', 50: '፶',
      60: '፷', 70: '፸', 80: '፹', 90: '፺',
      100: '፻', 10000: '፼'
    };

    if (ethiopicNumerals[num]) {
      return ethiopicNumerals[num];
    }

    let result = '';
    let remaining = num;

    // Handle tens and ones (up to 99)
    if (remaining < 100) {
      const tens = Math.floor(remaining / 10) * 10;
      const ones = remaining % 10;
      
      if (tens > 0) result += ethiopicNumerals[tens];
      if (ones > 0) result += ethiopicNumerals[ones];
      
      return result;
    }

    // For numbers >= 100, use a simpler digit-by-digit approach
    const digits = num.toString().split('');
    return digits.map(d => ethiopicNumerals[parseInt(d)] || d).join('');
  }

  /**
   * Get current Ethiopian date
   * @returns {Object} Ethiopian date {year, month, day}
   */
  now() {
    return this.toEthiopian(new Date());
  }
}

export default EthiopianCalendar;

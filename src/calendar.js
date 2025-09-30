/**
 * Ethiopian Calendar Utility
 * Converts between Gregorian and Ethiopian calendars
 * Ethiopian calendar has 13 months (12 months of 30 days + 1 month of 5/6 days)
 */

class EthiopianCalendar {
  constructor() {
    this.monthNames = [
      'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
      'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
    ];

    this.monthNamesAmharic = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    this.dayNames = ['Ehud', 'Segno', 'Maksegno', 'Erob', 'Hamus', 'Arb', 'Kidame'];

    this.dayNamesAmharic = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
  }

  /**
   * Convert Gregorian date to Ethiopian date
   * @param {Date} gregorianDate - Gregorian date object
   * @returns {Object} Ethiopian date {year, month, day}
   */
  toEthiopian(gregorianDate) {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();
    
    // JDN (Julian Day Number) calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
              Math.floor(y / 4) - Math.floor(y / 100) + 
              Math.floor(y / 400) - 32045;
    
    // Convert JDN to Ethiopian
    const r = (jdn - 1723856) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    
    const ethYear = Math.floor((jdn - 1723856) / 1461) + 1;
    const ethMonth = Math.floor(n / 30) + 1;
    const ethDay = (n % 30) + 1;
    
    return {
      year: ethYear,
      month: ethMonth,
      day: ethDay
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
    // Calculate JDN from Ethiopian date
    const jdn = (year - 1) * 1461 / 4 + (month - 1) * 30 + day + 1723856;
    
    // Convert JDN to Gregorian
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const gregDay = e - Math.floor((153 * m + 2) / 5) + 1;
    const gregMonth = m + 3 - 12 * Math.floor(m / 10);
    const gregYear = 100 * b + d - 4800 + Math.floor(m / 10);
    
    return new Date(gregYear, gregMonth - 1, gregDay);
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
    return (year % 4) === 3;
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
    const names = useAmharic ? this.monthNamesAmharic : this.monthNames;
    return names[month - 1] || '';
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

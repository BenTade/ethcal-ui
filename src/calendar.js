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
   * Helper function to calculate Ethiopian new year day
   * @param {number} year - Ethiopian year
   * @returns {number} New year day
   * @private
   */
  _startDayOfEthiopian(year) {
    const newYearDay = Math.floor(year / 100) - Math.floor(year / 400) - 4;
    // if the prev ethiopian year is a leap year, new-year occurs on 12th
    return ((year - 1) % 4 === 3) ? newYearDay + 1 : newYearDay;
  }

  /**
   * Convert Gregorian date to Ethiopian date
   * @param {Date} gregorianDate - Gregorian date object
   * @returns {Object} Ethiopian date {year, month, day}
   */
  toEthiopian(gregorianDate) {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const date = gregorianDate.getDate();
    
    // Validate input
    if (month === 10 && date >= 5 && date <= 14 && year === 1582) {
      throw new Error('Invalid Date between 5-14 May 1582.');
    }
    
    // Number of days in gregorian months starting with January (index 1)
    const gregorianMonths = [0.0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Number of days in ethiopian months starting with January (index 1)
    const ethiopianMonths = [0.0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5, 30, 30, 30, 30];
    
    // if gregorian leap year, February has 29 days
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      gregorianMonths[2] = 29;
    }
    
    // September sees 8y difference
    let ethiopianYear = year - 8;
    
    // if ethiopian leap year pagumain has 6 days
    if (ethiopianYear % 4 === 3) {
      ethiopianMonths[10] = 6;
    }
    
    // Ethiopian new year in Gregorian calendar
    const newYearDay = this._startDayOfEthiopian(year - 8);
    
    // calculate number of days up to that date
    let until = 0;
    for (let i = 1; i < month; i++) {
      until += gregorianMonths[i];
    }
    until += date;
    
    // update tahissas (december) to match january 1st
    let tahissas = (ethiopianYear % 4) === 0 ? 26 : 25;
    
    // take into account the 1582 change
    if (year < 1582) {
      ethiopianMonths[1] = 0;
      ethiopianMonths[2] = tahissas;
    } else if (until <= 277 && year === 1582) {
      ethiopianMonths[1] = 0;
      ethiopianMonths[2] = tahissas;
    } else {
      tahissas = newYearDay - 3;
      ethiopianMonths[1] = tahissas;
    }
    
    // calculate month and date incremently
    let m;
    let ethiopianDate;
    for (m = 1; m < ethiopianMonths.length; m++) {
      if (until <= ethiopianMonths[m]) {
        ethiopianDate = (m === 1 || ethiopianMonths[m] === 0) ? until + (30 - tahissas) : until;
        break;
      } else {
        until -= ethiopianMonths[m];
      }
    }
    
    // if m > 10, we're already on next Ethiopian year
    if (m > 10) {
      ethiopianYear += 1;
    }
    
    // Ethiopian months ordered according to Gregorian
    const order = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4];
    const ethiopianMonth = order[m];
    
    return {
      year: ethiopianYear,
      month: ethiopianMonth,
      day: ethiopianDate
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
    // Ethiopian new year in Gregorian calendar
    const newYearDay = this._startDayOfEthiopian(year);
    
    // September (Ethiopian) sees 7y difference
    let gregorianYear = year + 7;
    
    // Number of days in gregorian months
    // starting with September (index 1)
    // Index 0 is reserved for leap years switches.
    // Index 4 is December, the final month of the year.
    let gregorianMonths = [0.0, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31, 31, 30];
    
    // if next gregorian year is leap year, February has 29 days.
    const nextYear = gregorianYear + 1;
    if ((nextYear % 4 === 0 && nextYear % 100 !== 0) || nextYear % 400 === 0) {
      gregorianMonths[6] = 29;
    }
    
    // calculate number of days up to that date
    let until = ((month - 1) * 30.0) + day;
    if (until <= 37 && year <= 1575) { // mysterious rule
      until += 28;
      gregorianMonths[0] = 31;
    } else {
      until += newYearDay - 1;
    }
    
    // if ethiopian year is leap year, paguemain has six days
    if ((year - 1) % 4 === 3) {
      until += 1;
    }
    
    // calculate month and date incremently
    let m = 0;
    let gregorianDate;
    for (let i = 0; i < gregorianMonths.length; i++) {
      if (until <= gregorianMonths[i]) {
        m = i;
        gregorianDate = until;
        break;
      } else {
        m = i;
        until -= gregorianMonths[i];
      }
    }
    
    // if m > 4, we're already on next Gregorian year
    if (m > 4) {
      gregorianYear += 1;
    }
    
    // Gregorian months ordered according to Ethiopian
    const order = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const gregorianMonth = order[m];
    
    return new Date(gregorianYear, gregorianMonth - 1, gregorianDate);
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

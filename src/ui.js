import EthiopianCalendar from './calendar.js';

/**
 * Ethiopian Calendar UI Popup Component
 */
class EthiopianCalendarUI {
  constructor(options = {}) {
    this.calendar = new EthiopianCalendar();
    this.options = {
      onSelect: options.onSelect || null,
      inputElement: options.inputElement || null,
      initialDate: options.initialDate || new Date(),
      showGregorian: options.showGregorian !== undefined ? options.showGregorian : true,
      useAmharic: options.useAmharic !== undefined ? options.useAmharic : true,
      useEthiopicNumbers: options.useEthiopicNumbers !== undefined ? options.useEthiopicNumbers : false,
      mergedView: options.mergedView !== undefined ? options.mergedView : false,
      primaryCalendar: options.primaryCalendar || 'ethiopian', // 'ethiopian' or 'gregorian'
      ...options
    };
    
    this.currentEthDate = this.calendar.toEthiopian(this.options.initialDate);
    this.selectedDate = null;
    this.popup = null;
  }

  /**
   * Create and show the calendar popup
   */
  show() {
    if (this.popup) {
      this.popup.style.display = 'block';
      return;
    }

    this.popup = this.createPopup();
    document.body.appendChild(this.popup);
    
    // Position popup
    this.positionPopup();
    
    this.render();
    this.attachEventListeners();
  }

  /**
   * Hide the calendar popup
   */
  hide() {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }

  /**
   * Destroy the popup
   */
  destroy() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  /**
   * Create the popup DOM structure
   */
  createPopup() {
    const popup = document.createElement('div');
    popup.className = 'ethcal-popup';
    
    const dayNamesHtml = this.options.useAmharic 
      ? '<div>እሁድ</div><div>ሰኞ</div><div>ማክሰኞ</div><div>ረቡዕ</div><div>ሐሙስ</div><div>ዓርብ</div><div>ቅዳሜ</div>'
      : '<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>';

    // Merged view - single calendar showing both dates
    if (this.options.mergedView) {
      const isPrimaryEthiopian = this.options.primaryCalendar === 'ethiopian';
      // Determine button labels based on primary calendar
      const yearPrevLabel = isPrimaryEthiopian ? '<አ' : '<Y';
      const monthPrevLabel = isPrimaryEthiopian ? '<ወ' : '<M';
      const monthNextLabel = isPrimaryEthiopian ? 'ወ>' : 'M>';
      const yearNextLabel = isPrimaryEthiopian ? 'አ>' : 'Y>';
      
      popup.innerHTML = `
        <div class="ethcal-calendars ethcal-merged">
          <div class="ethcal-calendar ethcal-merged-calendar">
            <div class="ethcal-header">
              <button class="ethcal-prev-year" aria-label="Previous Year">${yearPrevLabel}</button>
              <button class="ethcal-prev-month" aria-label="Previous Month">${monthPrevLabel}</button>
              <div class="ethcal-current">
                <div class="ethcal-primary-header">
                  <span class="ethcal-month-name"></span>
                  <span class="ethcal-year"></span>
                </div>
                <div class="ethcal-secondary-header">
                  <span class="ethcal-secondary-month-name"></span>
                  <span class="ethcal-secondary-year"></span>
                </div>
              </div>
              <button class="ethcal-next-month" aria-label="Next Month">${monthNextLabel}</button>
              <button class="ethcal-next-year" aria-label="Next Year">${yearNextLabel}</button>
            </div>
            <div class="ethcal-weekdays">${dayNamesHtml}</div>
            <div class="ethcal-days ethcal-merged-days"></div>
          </div>
        </div>
        <div class="ethcal-footer">
          <button class="ethcal-today">Today</button>
        </div>
      `;
    } else {
      // Original side-by-side view
      popup.innerHTML = `
        <div class="ethcal-calendars">
          <div class="ethcal-calendar ethcal-ethiopian">
            <div class="ethcal-header">
              <button class="ethcal-prev-year" aria-label="Previous Year"><አ</button>
              <button class="ethcal-prev-month" aria-label="Previous Month"><ወ</button>
              <div class="ethcal-current">
                <span class="ethcal-month-name"></span>
                <span class="ethcal-year"></span>
              </div>
              <button class="ethcal-next-month" aria-label="Next Month">ወ></button>
              <button class="ethcal-next-year" aria-label="Next Year">አ></button>
            </div>
            <div class="ethcal-weekdays">${dayNamesHtml}</div>
            <div class="ethcal-days"></div>
          </div>
          ${this.options.showGregorian ? `
          <div class="ethcal-calendar ethcal-gregorian">
            <div class="ethcal-header">
              <button class="ethcal-greg-prev-year" aria-label="Previous Year">&lt;Y</button>
              <button class="ethcal-greg-prev-month" aria-label="Previous Month">&lt;M</button>
              <div class="ethcal-current">
                <span class="ethcal-greg-month-name"></span>
                <span class="ethcal-greg-year"></span>
              </div>
              <button class="ethcal-greg-next-month" aria-label="Next Month">M&gt;</button>
              <button class="ethcal-greg-next-year" aria-label="Next Year">Y&gt;</button>
            </div>
            <div class="ethcal-weekdays">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div class="ethcal-greg-days"></div>
          </div>
          ` : ''}
        </div>
        <div class="ethcal-footer">
          <button class="ethcal-today">Today</button>
        </div>
      `;
    }
    return popup;
  }

  /**
   * Position popup near input element
   */
  positionPopup() {
    if (this.options.inputElement) {
      const rect = this.options.inputElement.getBoundingClientRect();
      this.popup.style.position = 'absolute';
      this.popup.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      this.popup.style.left = (rect.left + window.scrollX) + 'px';
    } else {
      // Center the popup if no input element
      this.popup.style.position = 'fixed';
      this.popup.style.top = '50%';
      this.popup.style.left = '50%';
      this.popup.style.transform = 'translate(-50%, -50%)';
    }
  }

  /**
   * Render the calendar
   */
  render() {
    const { year, month } = this.currentEthDate;
    
    // Update calendar header
    if (this.options.mergedView) {
      const isPrimaryEthiopian = this.options.primaryCalendar === 'ethiopian';
      
      // Update button labels based on primary calendar
      const yearPrevLabel = isPrimaryEthiopian ? '<አ' : '<Y';
      const monthPrevLabel = isPrimaryEthiopian ? '<ወ' : '<M';
      const monthNextLabel = isPrimaryEthiopian ? 'ወ>' : 'M>';
      const yearNextLabel = isPrimaryEthiopian ? 'አ>' : 'Y>';
      
      this.popup.querySelector('.ethcal-prev-year').textContent = yearPrevLabel;
      this.popup.querySelector('.ethcal-prev-month').textContent = monthPrevLabel;
      this.popup.querySelector('.ethcal-next-month').textContent = monthNextLabel;
      this.popup.querySelector('.ethcal-next-year').textContent = yearNextLabel;
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      
      if (isPrimaryEthiopian) {
        // Ethiopian is primary - use Amharic names and Ethiopian month
        const primaryMonthName = this.calendar.getMonthName(month, true);
        const primaryYear = year;
        
        this.popup.querySelector('.ethcal-month-name').textContent = primaryMonthName;
        this.popup.querySelector('.ethcal-year').textContent = primaryYear;
        
        // Get secondary (Gregorian) month range
        const secondaryRange = this.getSecondaryMonthRange(year, month, true);
        let secondaryText = '';
        
        if (secondaryRange.isSameMonth) {
          secondaryText = `${monthNames[secondaryRange.startMonth]} ${secondaryRange.startYear}`;
        } else {
          // Different months - show as range
          const startMonthName = monthNames[secondaryRange.startMonth];
          const endMonthName = monthNames[secondaryRange.endMonth];
          
          if (secondaryRange.startYear === secondaryRange.endYear) {
            secondaryText = `${startMonthName} - ${endMonthName} ${secondaryRange.startYear}`;
          } else {
            secondaryText = `${startMonthName} ${secondaryRange.startYear} - ${endMonthName} ${secondaryRange.endYear}`;
          }
        }
        
        this.popup.querySelector('.ethcal-secondary-month-name').textContent = secondaryText;
        this.popup.querySelector('.ethcal-secondary-year').textContent = '';
      } else {
        // Gregorian is primary - use English names and Gregorian month
        const gregDate = this.calendar.toGregorian(year, month, 1);
        const gregYear = gregDate.getFullYear();
        const gregMonth = gregDate.getMonth();
        
        this.popup.querySelector('.ethcal-month-name').textContent = monthNames[gregMonth];
        this.popup.querySelector('.ethcal-year').textContent = gregYear;
        
        // Get secondary (Ethiopian) month range - use Ethiopic script
        const secondaryRange = this.getSecondaryMonthRange(gregYear, gregMonth, false);
        let secondaryText = '';
        
        if (secondaryRange.isSameMonth) {
          const ethMonthName = this.calendar.getMonthName(secondaryRange.startMonth, true);
          secondaryText = `${ethMonthName} ${secondaryRange.startYear}`;
        } else {
          // Different months - show as range using Ethiopic script
          const startMonthName = this.calendar.getMonthName(secondaryRange.startMonth, true);
          const endMonthName = this.calendar.getMonthName(secondaryRange.endMonth, true);
          
          if (secondaryRange.startYear === secondaryRange.endYear) {
            secondaryText = `${startMonthName} - ${endMonthName} ${secondaryRange.startYear}`;
          } else {
            secondaryText = `${startMonthName} ${secondaryRange.startYear} - ${endMonthName} ${secondaryRange.endYear}`;
          }
        }
        
        this.popup.querySelector('.ethcal-secondary-month-name').textContent = secondaryText;
        this.popup.querySelector('.ethcal-secondary-year').textContent = '';
      }
      
      const titleElement = this.popup.querySelector('.ethcal-calendar-title');
      if (titleElement) {
        titleElement.textContent = `${isPrimaryEthiopian ? 'Ethiopian' : 'Gregorian'} Calendar (Primary)`;
      }
    } else {
      // Non-merged view - use the useAmharic option
      this.popup.querySelector('.ethcal-month-name').textContent = 
        this.calendar.getMonthName(month, this.options.useAmharic);
      // Year - always use Arabic numerals (not Ethiopic numbers)
      this.popup.querySelector('.ethcal-year').textContent = year;
    }
    
    // Update weekday names based on primary calendar or useAmharic option
    this.updateWeekdayNames();
    
    // Render appropriate calendar view
    if (this.options.mergedView) {
      this.renderMergedCalendar();
    } else {
      // Render Ethiopian calendar days
      this.renderDays();
      
      // Render Gregorian calendar if enabled
      if (this.options.showGregorian) {
        this.renderGregorianCalendar();
      }
    }
  }

  /**
   * Update weekday names based on options
   */
  updateWeekdayNames() {
    const selector = this.options.mergedView ? '.ethcal-merged-calendar .ethcal-weekdays' : '.ethcal-ethiopian .ethcal-weekdays';
    const weekdaysContainer = this.popup.querySelector(selector);
    if (weekdaysContainer) {
      // In merged view, use primary calendar's language
      // In non-merged view, use the useAmharic option
      const useAmharic = this.options.mergedView 
        ? (this.options.primaryCalendar === 'ethiopian')
        : this.options.useAmharic;
      
      if (useAmharic) {
        weekdaysContainer.innerHTML = '<div>እሁድ</div><div>ሰኞ</div><div>ማክሰኞ</div><div>ረቡዕ</div><div>ሐሙስ</div><div>ዓርብ</div><div>ቅዳሜ</div>';
      } else {
        weekdaysContainer.innerHTML = '<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>';
      }
    }
  }

  /**
   * Render calendar days
   */
  renderDays() {
    const { year, month } = this.currentEthDate;
    const daysContainer = this.popup.querySelector('.ethcal-days');
    daysContainer.innerHTML = '';
    
    const daysInMonth = this.calendar.getDaysInMonth(year, month);
    const firstDayOfWeek = this.calendar.getDayOfWeek(year, month, 1);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'ethcal-day ethcal-empty';
      daysContainer.appendChild(emptyCell);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'ethcal-day';
      const dayText = this.options.useEthiopicNumbers 
        ? this.calendar.toEthiopicNumeral(day)
        : day;
      dayCell.textContent = dayText;
      dayCell.dataset.day = day;
      dayCell.dataset.month = month;
      dayCell.dataset.year = year;
      
      // Highlight today
      const today = this.calendar.now();
      if (year === today.year && month === today.month && day === today.day) {
        dayCell.classList.add('ethcal-today-highlight');
      }
      
      // Highlight selected date
      if (this.selectedDate && 
          year === this.selectedDate.year && 
          month === this.selectedDate.month && 
          day === this.selectedDate.day) {
        dayCell.classList.add('ethcal-selected');
      }
      
      daysContainer.appendChild(dayCell);
    }
  }

  /**
   * Render Gregorian calendar
   */
  renderGregorianCalendar() {
    const { year, month } = this.currentEthDate;
    const gregDate = this.calendar.toGregorian(year, month, 1); // Use first day of month
    const gregYear = gregDate.getFullYear();
    const gregMonth = gregDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    this.popup.querySelector('.ethcal-greg-month-name').textContent = monthNames[gregMonth];
    this.popup.querySelector('.ethcal-greg-year').textContent = gregYear;
    
    // Render days
    const daysContainer = this.popup.querySelector('.ethcal-greg-days');
    daysContainer.innerHTML = '';
    
    const firstDay = new Date(gregYear, gregMonth, 1).getDay();
    const daysInMonth = new Date(gregYear, gregMonth + 1, 0).getDate();
    
    // Add empty cells
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'ethcal-day ethcal-empty';
      daysContainer.appendChild(emptyCell);
    }
    
    // Add days
    const todayGreg = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'ethcal-day ethcal-greg-day';
      dayCell.textContent = d;
      dayCell.dataset.day = d;
      dayCell.dataset.month = gregMonth;
      dayCell.dataset.year = gregYear;
      
      // Highlight today
      if (gregYear === todayGreg.getFullYear() && 
          gregMonth === todayGreg.getMonth() && 
          d === todayGreg.getDate()) {
        dayCell.classList.add('ethcal-today-highlight');
      }
      
      // Highlight if this Gregorian date corresponds to the selected Ethiopian date
      if (this.selectedDate) {
        const selectedGreg = this.calendar.toGregorian(
          this.selectedDate.year, 
          this.selectedDate.month, 
          this.selectedDate.day
        );
        if (gregYear === selectedGreg.getFullYear() && 
            gregMonth === selectedGreg.getMonth() && 
            d === selectedGreg.getDate()) {
          dayCell.classList.add('ethcal-selected');
        }
      }
      
      daysContainer.appendChild(dayCell);
    }
  }

  /**
   * Get the secondary month range for a given primary month
   * Returns the secondary months that overlap with the primary month
   */
  getSecondaryMonthRange(year, month, isPrimaryEthiopian) {
    if (isPrimaryEthiopian) {
      // Primary is Ethiopian, secondary is Gregorian
      const firstDay = this.calendar.toGregorian(year, month, 1);
      const daysInMonth = this.calendar.getDaysInMonth(year, month);
      const lastDay = this.calendar.toGregorian(year, month, daysInMonth);
      
      const firstMonth = firstDay.getMonth();
      const firstYear = firstDay.getFullYear();
      const lastMonth = lastDay.getMonth();
      const lastYear = lastDay.getFullYear();
      
      return {
        startMonth: firstMonth,
        startYear: firstYear,
        endMonth: lastMonth,
        endYear: lastYear,
        isSameMonth: firstMonth === lastMonth && firstYear === lastYear
      };
    } else {
      // Primary is Gregorian, secondary is Ethiopian
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0); // Last day of month
      
      const firstEth = this.calendar.toEthiopian(firstDay);
      const lastEth = this.calendar.toEthiopian(lastDay);
      
      return {
        startMonth: firstEth.month,
        startYear: firstEth.year,
        endMonth: lastEth.month,
        endYear: lastEth.year,
        isSameMonth: firstEth.month === lastEth.month && firstEth.year === lastEth.year
      };
    }
  }

  /**
   * Render merged calendar showing both Ethiopian and Gregorian dates
   */
  renderMergedCalendar() {
    const { year, month } = this.currentEthDate;
    const isPrimaryEthiopian = this.options.primaryCalendar === 'ethiopian';
    
    const daysContainer = this.popup.querySelector('.ethcal-merged-days');
    daysContainer.innerHTML = '';
    
    if (isPrimaryEthiopian) {
      // Ethiopian is primary
      const daysInMonth = this.calendar.getDaysInMonth(year, month);
      const firstDayOfWeek = this.calendar.getDayOfWeek(year, month, 1);
      
      // Add empty cells for days before month starts
      for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'ethcal-day ethcal-empty';
        daysContainer.appendChild(emptyCell);
      }
      
      // Add days of the month
      const today = this.calendar.now();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'ethcal-day ethcal-merged-day';
        
        // Primary date (Ethiopian) - use Ethiopic numbers if enabled
        const primaryText = this.options.useEthiopicNumbers 
          ? this.calendar.toEthiopicNumeral(day)
          : day;
        
        // Secondary date (Gregorian) - always use Arabic numerals
        const gregDate = this.calendar.toGregorian(year, month, day);
        const secondaryText = gregDate.getDate();
        
        dayCell.innerHTML = `
          <span class="ethcal-primary-date">${primaryText}</span>
          <span class="ethcal-secondary-date">${secondaryText}</span>
        `;
        
        dayCell.dataset.day = day;
        dayCell.dataset.month = month;
        dayCell.dataset.year = year;
        dayCell.dataset.gregDay = gregDate.getDate();
        dayCell.dataset.gregMonth = gregDate.getMonth();
        dayCell.dataset.gregYear = gregDate.getFullYear();
        
        // Highlight today
        if (year === today.year && month === today.month && day === today.day) {
          dayCell.classList.add('ethcal-today-highlight');
        }
        
        // Highlight selected date
        if (this.selectedDate && 
            year === this.selectedDate.year && 
            month === this.selectedDate.month && 
            day === this.selectedDate.day) {
          dayCell.classList.add('ethcal-selected');
        }
        
        daysContainer.appendChild(dayCell);
      }
    } else {
      // Gregorian is primary
      const gregDate = this.calendar.toGregorian(year, month, 1);
      const gregYear = gregDate.getFullYear();
      const gregMonth = gregDate.getMonth();
      
      const firstDay = new Date(gregYear, gregMonth, 1).getDay();
      const daysInMonth = new Date(gregYear, gregMonth + 1, 0).getDate();
      
      // Add empty cells
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'ethcal-day ethcal-empty';
        daysContainer.appendChild(emptyCell);
      }
      
      // Add days
      const todayGreg = new Date();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'ethcal-day ethcal-merged-day';
        
        // Primary date (Gregorian) - always use Arabic numerals
        const primaryText = d;
        
        // Secondary date (Ethiopian) - use Ethiopic numbers if enabled
        const currentGreg = new Date(gregYear, gregMonth, d);
        const ethDate = this.calendar.toEthiopian(currentGreg);
        const secondaryText = this.options.useEthiopicNumbers 
          ? this.calendar.toEthiopicNumeral(ethDate.day)
          : ethDate.day;
        
        dayCell.innerHTML = `
          <span class="ethcal-primary-date">${primaryText}</span>
          <span class="ethcal-secondary-date">${secondaryText}</span>
        `;
        
        dayCell.dataset.day = ethDate.day;
        dayCell.dataset.month = ethDate.month;
        dayCell.dataset.year = ethDate.year;
        dayCell.dataset.gregDay = d;
        dayCell.dataset.gregMonth = gregMonth;
        dayCell.dataset.gregYear = gregYear;
        
        // Highlight today
        if (gregYear === todayGreg.getFullYear() && 
            gregMonth === todayGreg.getMonth() && 
            d === todayGreg.getDate()) {
          dayCell.classList.add('ethcal-today-highlight');
        }
        
        // Highlight selected date
        if (this.selectedDate) {
          const selectedGreg = this.calendar.toGregorian(
            this.selectedDate.year, 
            this.selectedDate.month, 
            this.selectedDate.day
          );
          if (gregYear === selectedGreg.getFullYear() && 
              gregMonth === selectedGreg.getMonth() && 
              d === selectedGreg.getDate()) {
            dayCell.classList.add('ethcal-selected');
          }
        }
        
        daysContainer.appendChild(dayCell);
      }
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Ethiopian calendar navigation buttons
    this.popup.querySelector('.ethcal-prev-year').addEventListener('click', () => {
      this.currentEthDate.year--;
      this.render();
    });
    
    this.popup.querySelector('.ethcal-next-year').addEventListener('click', () => {
      this.currentEthDate.year++;
      this.render();
    });
    
    this.popup.querySelector('.ethcal-prev-month').addEventListener('click', () => {
      this.currentEthDate.month--;
      if (this.currentEthDate.month < 1) {
        this.currentEthDate.month = 13;
        this.currentEthDate.year--;
      }
      this.render();
    });
    
    this.popup.querySelector('.ethcal-next-month').addEventListener('click', () => {
      this.currentEthDate.month++;
      if (this.currentEthDate.month > 13) {
        this.currentEthDate.month = 1;
        this.currentEthDate.year++;
      }
      this.render();
    });

    // Gregorian calendar navigation buttons (if enabled and not merged)
    if (this.options.showGregorian && !this.options.mergedView) {
      this.popup.querySelector('.ethcal-greg-prev-year').addEventListener('click', () => {
        const gregDate = this.calendar.toGregorian(this.currentEthDate.year, this.currentEthDate.month, 15);
        gregDate.setFullYear(gregDate.getFullYear() - 1);
        this.currentEthDate = this.calendar.toEthiopian(gregDate);
        this.render();
      });
      
      this.popup.querySelector('.ethcal-greg-next-year').addEventListener('click', () => {
        const gregDate = this.calendar.toGregorian(this.currentEthDate.year, this.currentEthDate.month, 15);
        gregDate.setFullYear(gregDate.getFullYear() + 1);
        this.currentEthDate = this.calendar.toEthiopian(gregDate);
        this.render();
      });
      
      this.popup.querySelector('.ethcal-greg-prev-month').addEventListener('click', () => {
        const gregDate = this.calendar.toGregorian(this.currentEthDate.year, this.currentEthDate.month, 15);
        gregDate.setMonth(gregDate.getMonth() - 1);
        this.currentEthDate = this.calendar.toEthiopian(gregDate);
        this.render();
      });
      
      this.popup.querySelector('.ethcal-greg-next-month').addEventListener('click', () => {
        const gregDate = this.calendar.toGregorian(this.currentEthDate.year, this.currentEthDate.month, 15);
        gregDate.setMonth(gregDate.getMonth() + 1);
        this.currentEthDate = this.calendar.toEthiopian(gregDate);
        this.render();
      });

      // Gregorian day selection
      this.popup.querySelector('.ethcal-greg-days').addEventListener('click', (e) => {
        if (e.target.classList.contains('ethcal-greg-day')) {
          const day = parseInt(e.target.dataset.day);
          const month = parseInt(e.target.dataset.month);
          const year = parseInt(e.target.dataset.year);
          
          const gregorianDate = new Date(year, month, day);
          const ethiopianDate = this.calendar.toEthiopian(gregorianDate);
          
          this.selectedDate = ethiopianDate;
          this.currentEthDate = ethiopianDate;
          this.render();
          
          if (this.options.onSelect) {
            this.options.onSelect({
              ethiopian: ethiopianDate,
              gregorian: gregorianDate
            });
          }
          
          // Update input if provided
          if (this.options.inputElement) {
            this.options.inputElement.value = `${ethiopianDate.day}/${ethiopianDate.month}/${ethiopianDate.year}`;
          }
          
          this.hide();
        }
      });
    }
    
    // Day selection (Ethiopian or merged)
    const daysSelector = this.options.mergedView ? '.ethcal-merged-days' : '.ethcal-days';
    this.popup.querySelector(daysSelector).addEventListener('click', (e) => {
      if (e.target.closest('.ethcal-day') && !e.target.closest('.ethcal-empty')) {
        const dayCell = e.target.closest('.ethcal-day');
        const day = parseInt(dayCell.dataset.day);
        const month = parseInt(dayCell.dataset.month);
        const year = parseInt(dayCell.dataset.year);
        
        this.selectedDate = { year, month, day };
        this.render();
        
        if (this.options.onSelect) {
          const gregorianDate = this.calendar.toGregorian(year, month, day);
          this.options.onSelect({
            ethiopian: { year, month, day },
            gregorian: gregorianDate
          });
        }
        
        // Update input if provided
        if (this.options.inputElement) {
          this.options.inputElement.value = `${day}/${month}/${year}`;
        }
        
        this.hide();
      }
    });
    
    // Today button
    this.popup.querySelector('.ethcal-today').addEventListener('click', () => {
      this.currentEthDate = this.calendar.now();
      this.render();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.popup && 
          !this.popup.contains(e.target) && 
          e.target !== this.options.inputElement) {
        this.hide();
      }
    });
  }

  /**
   * Set the current date
   * @param {Date} date - Gregorian date
   */
  setDate(date) {
    this.currentEthDate = this.calendar.toEthiopian(date);
    if (this.popup) {
      this.render();
    }
  }

  /**
   * Get the selected date
   * @returns {Object} Selected date info
   */
  getSelectedDate() {
    return this.selectedDate;
  }
}

export default EthiopianCalendarUI;

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
    
    // Position popup near input element if provided
    if (this.options.inputElement) {
      this.positionPopup();
    }
    
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
    popup.innerHTML = `
      <div class="ethcal-header">
        <button class="ethcal-prev-year" aria-label="Previous Year">&laquo;</button>
        <button class="ethcal-prev-month" aria-label="Previous Month">&lsaquo;</button>
        <div class="ethcal-current">
          <span class="ethcal-month-name"></span>
          <span class="ethcal-year"></span>
        </div>
        <button class="ethcal-next-month" aria-label="Next Month">&rsaquo;</button>
        <button class="ethcal-next-year" aria-label="Next Year">&raquo;</button>
      </div>
      <div class="ethcal-weekdays">
        <div>እሁድ</div>
        <div>ሰኞ</div>
        <div>ማክሰኞ</div>
        <div>ረቡዕ</div>
        <div>ሐሙስ</div>
        <div>ዓርብ</div>
        <div>ቅዳሜ</div>
      </div>
      <div class="ethcal-days"></div>
      <div class="ethcal-footer">
        <button class="ethcal-today">Today</button>
        <button class="ethcal-close">Close</button>
      </div>
    `;
    return popup;
  }

  /**
   * Position popup near input element
   */
  positionPopup() {
    const rect = this.options.inputElement.getBoundingClientRect();
    this.popup.style.position = 'absolute';
    this.popup.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    this.popup.style.left = (rect.left + window.scrollX) + 'px';
  }

  /**
   * Render the calendar
   */
  render() {
    const { year, month } = this.currentEthDate;
    
    // Update header
    this.popup.querySelector('.ethcal-month-name').textContent = 
      this.calendar.getMonthName(month);
    this.popup.querySelector('.ethcal-year').textContent = year;
    
    // Render days
    this.renderDays();
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
      dayCell.textContent = day;
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
   * Attach event listeners
   */
  attachEventListeners() {
    // Navigation buttons
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
    
    // Day selection
    this.popup.querySelector('.ethcal-days').addEventListener('click', (e) => {
      if (e.target.classList.contains('ethcal-day') && !e.target.classList.contains('ethcal-empty')) {
        const day = parseInt(e.target.dataset.day);
        const month = parseInt(e.target.dataset.month);
        const year = parseInt(e.target.dataset.year);
        
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
    
    // Close button
    this.popup.querySelector('.ethcal-close').addEventListener('click', () => {
      this.hide();
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

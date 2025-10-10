import React, { useEffect, useRef, useState } from 'react';
import { EthiopianCalendarUI } from 'ethcal-ui';

/**
 * Ethiopian Calendar React Component
 * 
 * @param {Function} onSelect - Callback when date is selected
 * @param {string} value - Initial value for the input
 * @param {string} placeholder - Placeholder text
 * @param {Date} initialDate - Initial date to display in calendar
 * @param {boolean} showGregorian - Show Gregorian calendar side-by-side (default: true)
 * @param {boolean} useAmharic - Use Amharic names (default: true)
 * @param {boolean} useEthiopicNumbers - Use Ethiopic numerals (default: false)
 * @param {boolean} mergedView - Enable merged calendar view (default: false)
 * @param {string} primaryCalendar - Primary calendar: 'ethiopian' or 'gregorian' (default: 'ethiopian')
 */
export const EthiopianDatePicker = ({ 
  onSelect, 
  value, 
  placeholder = "Select date",
  initialDate,
  showGregorian = true,
  useAmharic = true,
  useEthiopicNumbers = false,
  mergedView = false,
  primaryCalendar = 'ethiopian'
}) => {
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(value || '');

  useEffect(() => {
    if (inputRef.current && !calendarRef.current) {
      calendarRef.current = new EthiopianCalendarUI({
        inputElement: inputRef.current,
        initialDate,
        showGregorian,
        useAmharic,
        useEthiopicNumbers,
        mergedView,
        primaryCalendar,
        onSelect: (date) => {
          const eth = date.ethiopian;
          const displayValue = `${eth.day}/${eth.month}/${eth.year}`;
          setSelectedDate(displayValue);
          if (onSelect) {
            onSelect(date);
          }
        }
      });
    }

    return () => {
      if (calendarRef.current) {
        calendarRef.current.destroy();
        calendarRef.current = null;
      }
    };
  }, [onSelect, initialDate, showGregorian, useAmharic, useEthiopicNumbers, mergedView, primaryCalendar]);

  const handleClick = () => {
    if (calendarRef.current) {
      calendarRef.current.show();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={selectedDate}
      placeholder={placeholder}
      onClick={handleClick}
      readOnly
      style={{
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '250px',
        cursor: 'pointer'
      }}
    />
  );
};

/**
 * Example usage in a React app:
 * 
 * import { EthiopianDatePicker } from './EthiopianDatePicker';
 * 
 * function App() {
 *   const handleDateSelect = (date) => {
 *     console.log('Ethiopian:', date.ethiopian);
 *     console.log('Gregorian:', date.gregorian);
 *   };
 * 
 *   return (
 *     <div>
 *       <h1>Ethiopian Calendar</h1>
 *       
 *       {/* Basic usage */}
 *       <EthiopianDatePicker onSelect={handleDateSelect} />
 *       
 *       {/* With Ethiopic numerals */}
 *       <EthiopianDatePicker 
 *         onSelect={handleDateSelect} 
 *         useEthiopicNumbers={true}
 *       />
 *       
 *       {/* Merged view with Gregorian as primary */}
 *       <EthiopianDatePicker 
 *         onSelect={handleDateSelect} 
 *         mergedView={true}
 *         primaryCalendar="gregorian"
 *       />
 *       
 *       {/* With initial date (Ethiopian New Year 2017) */}
 *       <EthiopianDatePicker 
 *         onSelect={handleDateSelect} 
 *         initialDate={new Date(2024, 8, 11)}
 *       />
 *       
 *       {/* English names */}
 *       <EthiopianDatePicker 
 *         onSelect={handleDateSelect} 
 *         useAmharic={false}
 *       />
 *     </div>
 *   );
 * }
 */

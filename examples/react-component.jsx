import React, { useEffect, useRef, useState } from 'react';
import { EthiopianCalendarUI } from 'ethcal-ui';

/**
 * Ethiopian Calendar React Component
 */
export const EthiopianDatePicker = ({ onSelect, value, placeholder = "Select date" }) => {
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(value || '');

  useEffect(() => {
    if (inputRef.current && !calendarRef.current) {
      calendarRef.current = new EthiopianCalendarUI({
        inputElement: inputRef.current,
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
  }, [onSelect]);

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
 *       <EthiopianDatePicker onSelect={handleDateSelect} />
 *     </div>
 *   );
 * }
 */

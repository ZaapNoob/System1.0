import { useState, useEffect } from "react";
import "./DatePicker.css";

export default function DatePicker({ value, onChange, name }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Convert YYYY-MM-DD from database to DD/MM/YYYY for display
    if (value) {
      if (value.includes("-")) {
        // Database format: YYYY-MM-DD
        const [y, m, d] = value.split("-");
        setInputValue(`${d}/${m}/${y}`);
      } else if (value.includes("/")) {
        // Already in DD/MM/YYYY format
        setInputValue(value);
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    let input = e.target.value;

    // Allow backspace and empty value
    if (input === "") {
      setInputValue("");
      onChange({ target: { name, value: "" } });
      return;
    }

    // Remove non-numeric characters
    input = input.replace(/\D/g, "");

    // Format as DD/MM/YYYY with validation
    let formatted = "";
    let day = "";
    let month = "";
    let year = "";

    if (input.length > 0) {
      day = input.slice(0, 2);
      
      // Validate day (01-31)
      if (day.length === 2) {
        const dayNum = parseInt(day, 10);
        if (dayNum > 31) {
          day = "31";
        } else if (dayNum === 0) {
          day = "01";
        }
      }
      
      formatted = day;

      if (input.length >= 3) {
        month = input.slice(2, 4);
        
        // Validate month (01-12)
        if (month.length === 2) {
          const monthNum = parseInt(month, 10);
          if (monthNum > 12) {
            month = "12";
          } else if (monthNum === 0) {
            month = "01";
          }
        }
        
        formatted += "/" + month;
      }

      if (input.length >= 5) {
        year = input.slice(4, 8);
        
        // Validate year (1900-current year)
        const currentYear = new Date().getFullYear();
        if (year.length === 4) {
          const yearNum = parseInt(year, 10);
          if (yearNum > currentYear) {
            year = String(currentYear);
          } else if (yearNum < 1900) {
            year = "1900";
          }
        }
        
        formatted += "/" + year;
      }
    }

    setInputValue(formatted);

    // Only update parent when complete (DD/MM/YYYY format)
    if (formatted.length === 10) {
      // Convert DD/MM/YYYY to YYYY-MM-DD for database
      const [d, m, y] = formatted.split("/");
      const dbFormat = `${y}-${m}-${d}`;
      onChange({ target: { name, value: dbFormat } });
    }
  };

  return (
    <div className="dob-picker">
      <input
        type="text"
        className="dob-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="DD/MM/YYYY"
        maxLength="10"
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import "./DatePicker.css";

export default function DatePicker({ value, onChange, name }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Convert YYYY-MM-DD from database to MM/DD/YYYY for display
    if (value) {
      if (value.includes("-")) {
        // Database format: YYYY-MM-DD
        const [y, m, d] = value.split("-");
        setInputValue(`${m}/${d}/${y}`);
      } else if (value.includes("/")) {
        // Already in MM/DD/YYYY format
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

    // Limit to 8 digits
    if (input.length > 8) {
      input = input.slice(0, 8);
    }

    // Format as MM/DD/YYYY with auto-slashes
    let formatted = "";

    if (input.length > 0) {
      // Add month (first 2 digits)
      formatted = input.slice(0, 2);
      
      // Validate month (01-12)
      const monthNum = parseInt(formatted, 10);
      if (monthNum > 12 && formatted.length === 2) {
        formatted = "12";
      } else if (monthNum === 0 && formatted.length === 2) {
        formatted = "01";
      }
    }

    // Add slash and day after 2 digits
    if (input.length > 2) {
      let day = input.slice(2, 4);
      
      // Validate day (01-31)
      const dayNum = parseInt(day, 10);
      if (dayNum > 31 && day.length === 2) {
        day = "31";
      } else if (dayNum === 0 && day.length === 2) {
        day = "01";
      }
      
      formatted += "/" + day;
    }

    // Add slash and year after 4 digits
    if (input.length > 4) {
      let year = input.slice(4, 8);
      
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

    setInputValue(formatted);

    // Only update parent when complete (MM/DD/YYYY format)
    if (formatted.length === 10) {
      // Convert MM/DD/YYYY to YYYY-MM-DD for database
      const [m, d, y] = formatted.split("/");
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
        placeholder="MM/DD/YYYY"
        maxLength="10"
      />
    </div>
  );
}

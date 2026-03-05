/**
 * Format date from YYYY-MM-DD to "Month DD, YYYY"
 * Example: "2026-02-28" becomes "February 28, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  
  try {
    // Extract just the date part if it includes time
    const datePart = dateString.includes(" ") ? dateString.split(" ")[0] : dateString;
    const date = new Date(datePart + "T00:00:00");
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  } catch (e) {
    return "—";
  }
};

/**
 * Format time from HH:MM:SS to 12-hour format with AM/PM
 * Example: "22:43:48" becomes "10:43 PM"
 * Also handles full datetime: "2026-02-28 22:43:48"
 */
export const formatTime = (timeString) => {
  if (!timeString) return "—";
  
  try {
    // Extract time part if it includes date
    const timePart = timeString.includes(" ") ? timeString.split(" ")[1] : timeString;
    const [hours, minutes] = timePart.split(":");
    
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  } catch (e) {
    return "—";
  }
};

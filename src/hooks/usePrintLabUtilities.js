/**
 * Custom hook for print laboratory utility functions
 * @returns {Object} - Collection of utility functions for printing lab requests
 */
export const usePrintLabUtilities = () => {
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatLongDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupTestsByCategory = (tests) => {
    return tests.reduce((acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = [];
      }
      acc[test.category].push(test);
      return acc;
    }, {});
  };

  const onClose = () => {
    window.close();
  };

  return {
    calculateAge,
    formatLongDate,
    groupTestsByCategory,
    onClose,
  };
};

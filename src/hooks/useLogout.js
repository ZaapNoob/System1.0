import API from "../config/api";

/**
 * Custom hook for handling logout functionality
 * @returns {Object} - handleLogout function
 */
export default function useLogout() {
  const handleLogout = async (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API}/auth/logout.php`, {
        method: "POST",
        headers: { Authorization: token }
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  return { handleLogout };
}
// Import React hooks
// useState → store data (user, loading, currentPage)
// useEffect → run code when the app starts
import { useEffect, useState } from "react";

// Import API configuration
import API from "./config/api";

// Import Login page component
import Login from "./pages/Login";

// Import Dashboard page component
import Dashboard from "./pages/Dashboard";

// Import Patient page component
import Patient from "./pages/Patient";

// Import QueueGen page component
import QueueGen from "./pages/QueueGen";

// Import Profile page component
import Profile from "./pages/Profile";

// Import ModalProvider
import { ModalProvider } from "./components/modal/ModalProvider";

// Main root component of the React app
export default function App() {

  // -----------------------------
  // STATE VARIABLES
  // -----------------------------

  // Holds the authenticated user object
  // null means "not logged in"
  const [user, setUser] = useState(null);

  // Tracks whether the app is still checking login status
  const [loading, setLoading] = useState(true);

  // Tracks which page is currently displayed
  // "dashboard", "profile", "patient", "queuegen"
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Stores the user's allowed pages from Profile settings
  const [allowedPages, setAllowedPages] = useState([]);

  // -----------------------------
  // RUN ON APP LOAD (AUTH CHECK)
  // -----------------------------

  // This effect runs once when the app loads
  useEffect(() => {
    // Read saved auth token from browser storage
    const token = localStorage.getItem("token");

    // If no token exists, user is not logged in
    if (!token) {
      setLoading(false); // Stop loading state
      return;
    }

    // Call backend to validate token and fetch user data
    fetch(`${API}/me.php`, {
      headers: {
        Authorization: `Bearer ${token}` // Send token in Bearer format
      }
    })
      .then(res => {
        // If token is invalid or expired
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        // Save authenticated user into state
        setUser(data.user ?? data);
      })
      .catch(() => {
        // If token is invalid, remove it
        localStorage.removeItem("token");
      })
      .finally(() => {
        // Auth check completed
        setLoading(false);
      });
  }, []); // Empty dependency array → run once on mount

  // -----------------------------
  // LOAD USER'S ALLOWED PAGES
  // -----------------------------

  // This effect runs whenever user changes (after login/logout)
  useEffect(() => {
    if (user?.id) {
      loadAllowedPages();
    } else {
      setAllowedPages([]); // Clear pages on logout
    }
  }, [user?.id]);

  // -----------------------------
  // API / DATA FUNCTIONS
  // -----------------------------

  const loadAllowedPages = async () => {
    try {
      const response = await fetch(
        `${API}/user-panels-get.php?user_id=${user.id}`
      );
      const pages = await response.json();
      setAllowedPages(pages || []);
    } catch (error) {
      console.error("Error loading allowed pages:", error);
    }
  };

  // -----------------------------
  // PAGE NAVIGATION HANDLERS
  // -----------------------------

  const handleAllowedPagesUpdate = (pages) => {
    setAllowedPages(pages);
  };

  // -----------------------------
  // CONDITIONAL RENDERING
  // -----------------------------

  // While checking auth status, show loading message
  if (loading) return <p>Loading...</p>;

  // If user is NOT logged in, show Login page
  if (!user) return <Login onLogin={setUser} />;

  // If user IS logged in, conditionally show Dashboard, Patient, QueueGen, or Profile

  if (currentPage === "profile") {
    return (
      <Profile
        user={user}
        onNavigateToDashboard={() => setCurrentPage("dashboard")}
        onAllowedPagesUpdate={handleAllowedPagesUpdate}
      />
    );
  }

  if (currentPage === "patient") {
    return (
      <ModalProvider>
        <Patient
          user={user}
          onNavigateToProfile={() => setCurrentPage("profile")}
          allowedPages={allowedPages}
          onNavigate={setCurrentPage}
        />
      </ModalProvider>
    );
  }

  if (currentPage === "queuegen") {
    return (
      <ModalProvider>
        <QueueGen
          user={user}
          allowedPages={allowedPages}
          onNavigate={setCurrentPage}
        />
      </ModalProvider>
    );
  }

  // Default: show Dashboard
  return (
    <Dashboard
      user={user}
      onNavigateToProfile={() => setCurrentPage("profile")}
      allowedPages={allowedPages}
      onNavigate={setCurrentPage}
    />
  );
}

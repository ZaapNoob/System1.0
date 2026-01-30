// Import useState hook from React
// useState lets this component store and update values (state)
import { useState } from "react";

// Import CSS file for styling the login page
import "./login.css";

// Import API configuration
import API from "../config/api";

// Export the Login component so it can be used in App.jsx
// onLogin is a function passed from the parent (App) to set the logged-in user
export default function Login({ onLogin }) {

  // State to store the email entered by the user
  const [email, setEmail] = useState("");

  // State to store the password entered by the user
  const [password, setPassword] = useState("");

  // State to toggle showing/hiding the password
  const [showPassword, setShowPassword] = useState(false);

  // Function that runs when the Login button is clicked
  const submit = async () => {

    // Validate input before sending to the backend
    // Prevent empty email or password
    if (!email.trim() || !password) {
      alert("Email and password are required");
      return;
    }

    // Create FormData object to send data as form fields
    // This matches how PHP reads data via $_POST
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    console.log("Login attempt with:", { email, password: "***" });

    // Send POST request to the backend login API
    const res = await fetch(`${API}/auth/login.php`, {
      method: "POST",
      body: form
    });

    console.log("Login response status:", res.status);

    // If HTTP status is NOT 200–299, login failed
    if (!res.ok) {
      let message = "Login failed";

      // Try to read error message from backend JSON
      try {
        const err = await res.json();
        console.log("Backend error:", err);
        if (typeof err?.error === "string" && err.error.trim()) {
          message = err.error;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      // Show error to the user
      alert(message);
      return;
    }

    // Parse successful response JSON
    const data = await res.json();
    console.log("Login successful:", data);

    // Save authentication token in browser storage
    // This token is used for future API requests
    localStorage.setItem("token", data.token);

    // Inform the parent component (App.jsx) that login succeeded
    // This updates the global user state
    onLogin(data.user ?? data);
  };

  // JSX UI returned by the component
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)} // Update email state
        />

        {/* Password input with show/hide toggle */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"} // Toggle visibility
            placeholder="Password"
            onChange={e => setPassword(e.target.value)} // Update password state
          />

          {/* Button to toggle password visibility */}
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* Login button triggers submit() */}
        <button onClick={submit}>Login</button>
      </div>
    </div>
  );
}

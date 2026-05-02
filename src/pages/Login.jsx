import { useState } from "react";
import "./login.css";
import API from "../config/api";
import MHOLogo from "../assets/MHO.jpg";
import LGULogo from "../assets/LGU.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      alert("Email and password are required");
      return;
    }

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    console.log("Login attempt with:", { email, password: "***" });

    const res = await fetch(`${API}/auth/login.php`, {
      method: "POST",
      body: form
    });

    console.log("Login response status:", res.status);

    if (!res.ok) {
      let message = "Login failed";
      try {
        const err = await res.json();
        console.log("Backend error:", err);
        if (typeof err?.error === "string" && err.error.trim()) {
          message = err.error;
        }
      } catch {
        // Ignore JSON parsing errors
      }
      alert(message);
      return;
    }

    const responseText = await res.text();
    console.log("Raw login response:", responseText);
    
    const data = JSON.parse(responseText);
    console.log("Login successful:", data);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user ?? data));
    onLogin(data.user ?? data);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        
        {/* Logo Container for 2 Logos */}
        <div className="logo-container">
          <img src={MHOLogo} alt="Primary Logo" className="logo" />
          <div className="logo-divider"></div>
          <img src={LGULogo} alt="Secondary Logo" className="logo" />
        </div>

        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to access the system</p>
        </div>

        <div className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button className="submit-btn" onClick={submit}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
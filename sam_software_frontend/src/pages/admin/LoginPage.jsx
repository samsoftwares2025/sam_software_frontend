// src/pages/login/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/CompanyRegistrationPage.css";
import { loginUser } from "../../api/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log("SENDING LOGIN REQUEST:", { email, password });
      const data = await loginUser(email, password);
      console.log("LOGIN SUCCESS:", data);

      // loginUser already called setAuth(); we just navigate
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("LOGIN FAILED RAW ERROR:", err);

      let message = "Something went wrong while logging in";

      if (err.response) {
        console.log("ERROR RESPONSE DATA:", err.response.data);
        const d = err.response.data;

        message =
          d.detail ||
          d.message ||
          (Array.isArray(d.non_field_errors) && d.non_field_errors[0]) ||
          d.error ||
          "Invalid email or password";
      } else if (err.request) {
        message = "No response from server. Check if backend is running.";
      } else {
        message = err.message || message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="login-left">
          <h1>
            Welcome back
            <br />
            to HR Partner
          </h1>
          <p>Manage hiring, employees, and payroll from one central HR workspace.</p>

          <div className="features">
            <div className="feature-item">✔ Unified employee records</div>
            <div className="feature-item">✔ Smart approvals & workflows</div>
            <div className="feature-item">✔ Secure & role-based access</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="login-header">
            <h2>Sign in to your account</h2>
            <p>Use your admin or employee credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="section-title">Login Details</div>

            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

            <div className="input-group">
              <label htmlFor="email">Work Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "var(--accent)",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" name="remember" />
                <span>Keep me signed in</span>
              </label>

              <a href="#" style={{ fontSize: "13px", color: "var(--accent)" }}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="signup-link">
              New to HR Partner? <a href="/admin/registration">Create a company account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

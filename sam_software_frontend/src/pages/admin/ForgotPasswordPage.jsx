import React, { useState } from "react";
import "../../assets/styles/CompanyRegistrationPage.css";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("email"); // "email" | "otp" | "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    // TODO: Call API to trigger OTP email
    // Example: await api.sendOtp(email);

    setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    // TODO: Replace this with real OTP validation
    // For now, just simulate success if something is typed
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    // If OTP is correct (simulate)
    setStep("success");

    // In a real app you might:
    // - Redirect to reset password page, OR
    // - Call API that sends reset link to email
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="login-left">
          <h1>
            Forgot your
            <br />
            password?
          </h1>
          <p>
            No worries. Enter your registered work email, verify with OTP, and
            we&apos;ll help you securely reset your password.
          </p>
          <div className="features">
            <div className="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Secure verification using OTP</span>
            </div>
            <div className="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>No password sharing with anyone</span>
            </div>
            <div className="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Works for admin &amp; employees</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL – FORGOT PASSWORD FLOW */}
        <div className="login-right">
          <div className="login-header">
            <h2>Forgot Password</h2>
            <p>Enter your linked work email to receive an OTP</p>
          </div>

          {step !== "success" && (
            <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}>
              <div className="section-title">
                {step === "email" ? "Verify Email" : "Enter OTP"}
              </div>

              {/* EMAIL STEP */}
              <div className="input-group">
                <label htmlFor="email">Registered Work Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={step === "otp"}
                  />
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {step === "otp" && (
                  <p className="hint-text">
                    OTP has been sent to <strong>{email}</strong>. Please check
                    your inbox (and spam folder).
                  </p>
                )}
              </div>

              {/* OTP STEP (shown after email submitted) */}
              {step === "otp" && (
                <div className="input-group">
                  <label htmlFor="otp">OTP</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="Enter the 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zM5 20h14a2 2 0 002-2v-1a5 5 0 00-5-5H8a5 5 0 00-5 5v1a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="hint-text">
                    Didn&apos;t receive the OTP?{" "}
                    <button
                      type="button"
                      className="link-button"
                      onClick={handleSendOtp}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              )}

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="login-btn">
                {step === "email" ? "Send OTP" : "Verify OTP"}
              </button>

              <div className="signup-link">
                Remember your password? <a href="/">Back to login</a>
              </div>
            </form>
          )}

          {/* SUCCESS MESSAGE */}
          {step === "success" && (
            <div>
              <div className="section-title">Check your email</div>
              <p className="info-text">
                If the OTP was correct, a{" "}
                <strong>reset password link has been sent</strong> to your
                registered email address: <strong>{email}</strong>.
              </p>
              <p className="info-text">
                Please open the email and follow the instructions to set a new
                password for your HR Partner account.
              </p>

              <button
                type="button"
                className="login-btn"
                onClick={() => (window.location.href = "/")}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

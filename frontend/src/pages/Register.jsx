import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../service/api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        fullName,
        email,
        password
      );

      navigate("/", {
        state: {
          registrationSuccess: true,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Brand Section */}
      <section className="register-brand-section">

        <div className="register-brand-content">

          <div className="register-logo">
            SkillSwap
          </div>

          <h1>
            Share your skills.
            <br />
            Learn something new.
          </h1>

          <p>
            Join a community of students who learn
            from each other by sharing their knowledge,
            experience and skills.
          </p>

          <div className="register-feature-list">

            <div className="register-feature-item">
              <span>✓</span>
              Add skills you can teach
            </div>

            <div className="register-feature-item">
              <span>✓</span>
              Discover skills you want to learn
            </div>

            <div className="register-feature-item">
              <span>✓</span>
              Connect through skill exchanges
            </div>

          </div>

        </div>

        <p className="register-brand-footer">
          SkillSwap Student Skill Exchange Platform
        </p>

      </section>


      {/* Registration Form */}
      <section className="register-form-section">

        <div className="register-card">

          <div className="register-card-header">

            <span className="register-small-label">
              JOIN SKILLSWAP
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start learning and sharing skills with
              other students.
            </p>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Full Name */}
            <div className="register-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  minLength="2"
                  maxLength="100"
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="register-form-group">

              <label htmlFor="registerEmail">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ✉
                </span>

                <input
                  id="registerEmail"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="register-form-group">

              <label htmlFor="registerPassword">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="registerPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  minLength="8"
                  maxLength="50"
                  autoComplete="new-password"
                  required
                />

                <button
                  className="register-password-toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}
            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter password again"
                  minLength="8"
                  maxLength="50"
                  autoComplete="new-password"
                  required
                />

                <button
                  className="register-password-toggle"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            <button
              className="register-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          <div className="register-divider">
            <span />
            <p>Already have an account?</p>
            <span />
          </div>


          <Link
            className="register-login-link"
            to="/"
          >
            Sign In to SkillSwap
          </Link>


          <p className="register-note">
            New accounts are created as student accounts.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Register;
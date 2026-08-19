import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../service/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left side */}
      <section className="login-brand-section">

        <div className="login-brand-content">

          <div className="login-logo">
            SkillSwap
          </div>

          <h1>
            Learn from others.
            <br />
            Share what you know.
          </h1>

          <p>
            Connect with students, exchange skills and
            grow together through meaningful learning.
          </p>

          <div className="login-feature-list">

            <div className="login-feature-item">
              <span>✓</span>
              Find students with matching skills
            </div>

            <div className="login-feature-item">
              <span>✓</span>
              Schedule skill exchange sessions
            </div>

            <div className="login-feature-item">
              <span>✓</span>
              Learn. Teach. Connect.
            </div>

          </div>

        </div>

        <p className="login-brand-footer">
          SkillSwap Student Skill Exchange Platform
        </p>

      </section>


      {/* Right side */}
      <section className="login-form-section">

        <div className="login-card">

          <div className="login-card-header">

            <span className="login-small-label">
              WELCOME BACK
            </span>

            <h2>
              Sign in to SkillSwap
            </h2>

            <p>
              Enter your account details to continue.
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉
                </span>

                <input
                  id="email"
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


            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <button
              className="login-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          <div className="login-divider">
            <span />
            <p>New to SkillSwap?</p>
            <span />
          </div>


          <Link
            className="login-register-link"
            to="/register"
          >
            Create a Student Account
          </Link>


          <p className="login-note">
            Admin accounts also sign in from this page.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;
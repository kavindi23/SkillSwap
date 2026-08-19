import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import StudentLayout from "../components/StudentLayout";

import {
  getMatches,
  getMyExchanges,
  getMyProfile,
  getMySkills,
} from "../service/api";

import "./Dashboard.css";


function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState({
    teach: [],
    learn: [],
  });

  const [exchanges, setExchanges] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const [
          profileData,
          skillsData,
          exchangeData,
          matchData,
        ] = await Promise.all([
          getMyProfile(),
          getMySkills(),
          getMyExchanges(),
          getMatches(),
        ]);

        setProfile(profileData);

        setSkills({
          teach: skillsData.teach || [],
          learn: skillsData.learn || [],
        });

        setExchanges(exchangeData || []);
        setMatches(matchData || []);
      } catch (err) {
        console.error(err);

        setError(err.message);

        if (
          err.message === "Invalid or expired token" ||
          err.message === "Your account is inactive"
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");

          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }


  // =========================
  // DASHBOARD VALUES
  // =========================

  const activeExchanges = exchanges.filter(
    (exchange) =>
      exchange.status === "ACTIVE"
  );


  const initials =
    profile?.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";


  return (
    <StudentLayout>

      <div className="dashboard-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="dashboard-header">

          <div>

            <p className="welcome-label">
              WELCOME BACK
              {profile?.full_name
                ? `, ${profile.full_name.toUpperCase()}`
                : ""}
            </p>

            <h1>
              SkillSwap Dashboard
            </h1>

            <p className="welcome-text">
              Find students, exchange knowledge
              and grow your skills.
            </p>

          </div>


          {/* CLICKABLE PROFILE AVATAR */}

          <Link
            to="/profile"
            className="user-avatar user-avatar-link"
            title="View My Profile"
            aria-label="View my profile"
          >
            {initials}
          </Link>

        </header>


        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* =========================
            STATISTICS
        ========================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              📚
            </span>

            <div>

              <p>
                Skills I Teach
              </p>

              <h2>
                {skills.teach.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🎯
            </span>

            <div>

              <p>
                Skills I Want
              </p>

              <h2>
                {skills.learn.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🤝
            </span>

            <div>

              <p>
                Active Exchanges
              </p>

              <h2>
                {activeExchanges.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              ⭐
            </span>

            <div>

              <p>
                My Rating
              </p>

              <h2>
                {Number(
                  profile?.rating || 0
                ).toFixed(1)}
              </h2>

            </div>

          </div>

        </section>


        {/* =========================
            DASHBOARD CONTENT
        ========================== */}

        <section className="dashboard-grid">

          {/* =========================
              SKILL MATCHES
          ========================== */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div>

                <h3>
                  Skill Matches
                </h3>

                <p>
                  Students who may be a good
                  match for you.
                </p>

              </div>


              <Link to="/matches">
                View All
              </Link>

            </div>


            {matches.length === 0 ? (

              <div className="empty-state">

                <span>
                  🤝
                </span>

                <h4>
                  Discover your matches
                </h4>

                <p>
                  Add skills you can teach and
                  skills you want to learn.
                </p>

                <Link
                  className="primary-button"
                  to="/matches"
                >
                  Find Matches
                </Link>

              </div>

            ) : (

              <div className="match-preview-list">

                {matches
                  .slice(0, 3)
                  .map((match) => (

                    <div
                      className="match-preview"
                      key={match.user_id}
                    >

                      <div>

                        <h4>
                          {match.full_name}
                        </h4>


                        <p>
                          They teach:{" "}
                          {match.they_can_teach_me?.length
                            ? match.they_can_teach_me
                                .map(
                                  (skill) =>
                                    skill.name
                                )
                                .join(", ")
                            : "Not available"}
                        </p>


                        <p>
                          You teach:{" "}
                          {match.i_can_teach_them?.length
                            ? match.i_can_teach_them
                                .map(
                                  (skill) =>
                                    skill.name
                                )
                                .join(", ")
                            : "Not available"}
                        </p>

                      </div>


                      <span>
                        ⭐{" "}
                        {Number(
                          match.rating || 0
                        ).toFixed(1)}
                      </span>

                    </div>

                  ))}

              </div>

            )}

          </div>


          {/* =========================
              QUICK ACTIONS
          ========================== */}

          <div className="dashboard-card">

            <div className="card-heading">

              <div>

                <h3>
                  Quick Actions
                </h3>

                <p>
                  Continue your SkillSwap journey.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <Link to="/skills">
                + Add a Skill
              </Link>

              <Link to="/matches">
                Find a Match
              </Link>

              <Link to="/exchanges">
                View Exchanges
              </Link>

              <Link to="/notifications">
                Notifications
              </Link>

            </div>

          </div>

        </section>

      </div>

    </StudentLayout>
  );
}


export default Dashboard;
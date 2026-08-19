import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentLayout from "../components/StudentLayout";

import {
  getMatches,
  sendExchangeRequest,
} from "../service/api";

import "./Matches.css";


function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =========================
  // LOAD MATCHES
  // =========================

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setError("");

        const data = await getMatches();

        setMatches(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);


  // =========================
  // SEND EXCHANGE REQUEST
  // =========================

  const handleSendRequest = async (match) => {
    if (
      !match.i_can_teach_them?.length ||
      !match.they_can_teach_me?.length
    ) {
      setError(
        "Matching skills are not available."
      );

      return;
    }

    const offeredSkill =
      match.i_can_teach_them[0];

    const requestedSkill =
      match.they_can_teach_me[0];

    const confirmed = window.confirm(
      `Send an exchange request to ${match.full_name}?\n\n` +
        `You teach: ${offeredSkill.name}\n` +
        `They teach: ${requestedSkill.name}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSendingId(match.user_id);

      setError("");
      setMessage("");

      await sendExchangeRequest({
        receiver_id: match.user_id,

        offered_skill_id:
          offeredSkill.skill_id,

        requested_skill_id:
          requestedSkill.skill_id,

        message:
          `Would you like to exchange ${offeredSkill.name} ` +
          `for ${requestedSkill.name}?`,
      });

      setMessage(
        `Exchange request sent to ${match.full_name} successfully.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingId(null);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="matches-loading">
        Loading matches...
      </div>
    );
  }


  return (
    <StudentLayout>

      <div className="matches-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="matches-header">

          <div>

            <p className="matches-label">
              SKILL MATCHES
            </p>

            <h1>
              Find Your Best Match
            </h1>

            <p>
              Connect with students who can teach
              what you want to learn and learn
              what you can teach.
            </p>

          </div>

        </header>


        {/* =========================
            SUCCESS / ERROR
        ========================== */}

        {message && (
          <div className="matches-success">
            {message}
          </div>
        )}

        {error && (
          <div className="matches-error">
            {error}
          </div>
        )}


        {/* =========================
            NO MATCHES
        ========================== */}

        {matches.length === 0 ? (

          <div className="no-matches-card">

            <span>
              🤝
            </span>

            <h2>
              No matches found yet
            </h2>

            <p>
              Add more teaching and learning
              skills to improve your chances
              of finding a two-way match.
            </p>

            <Link
              to="/skills"
              className="add-skills-link"
            >
              Manage My Skills
            </Link>

          </div>

        ) : (

          /* =========================
             MATCH LIST
          ========================== */

          <section className="matches-grid">

            {matches.map((match) => {
              const offeredSkill =
                match.i_can_teach_them?.[0];

              const requestedSkill =
                match.they_can_teach_me?.[0];

              const initials =
                match.full_name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U";

              return (
                <div
                  className="match-card"
                  key={match.user_id}
                >

                  {/* USER INFO */}

                  <div className="match-card-top">

                    <div className="match-avatar">
                      {initials}
                    </div>

                    <div>

                      <h2>
                        {match.full_name}
                      </h2>

                      <div className="match-meta">

                        <span>
                          ⭐{" "}
                          {Number(
                            match.rating || 0
                          ).toFixed(1)}
                        </span>

                        <span className="match-type">
                          TWO-WAY MATCH
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* EXCHANGE FLOW */}

                  <div className="exchange-flow">

                    <div className="skill-match-box teach-box">

                      <p>
                        YOU CAN TEACH
                      </p>

                      <h3>
                        {offeredSkill?.name ||
                          "Not available"}
                      </h3>

                    </div>


                    <div className="exchange-arrow">
                      ⇄
                    </div>


                    <div className="skill-match-box learn-box">

                      <p>
                        THEY CAN TEACH
                      </p>

                      <h3>
                        {requestedSkill?.name ||
                          "Not available"}
                      </h3>

                    </div>

                  </div>


                  {/* REQUEST BUTTON */}

                  <button
                    type="button"
                    className="request-button"
                    onClick={() =>
                      handleSendRequest(match)
                    }
                    disabled={
                      sendingId ===
                      match.user_id
                    }
                  >
                    {sendingId === match.user_id
                      ? "Sending..."
                      : "Send Exchange Request"}
                  </button>

                </div>
              );
            })}

          </section>
        )}

      </div>

    </StudentLayout>
  );
}


export default Matches;
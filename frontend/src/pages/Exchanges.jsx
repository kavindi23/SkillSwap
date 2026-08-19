import { useEffect, useState } from "react";

import StudentLayout from "../components/StudentLayout";

import {
  acceptExchangeRequest,
  completeExchange,
  completeSession,
  createExchangeSession,
  getExchangeSessions,
  getMyExchanges,
  getMyProfile,
  getReceivedExchangeRequests,
  getSentExchangeRequests,
  rejectExchangeRequest,
  submitReview,
} from "../service/api";

import "./Exchanges.css";


function Exchanges() {
  const [profile, setProfile] = useState(null);

  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [exchanges, setExchanges] = useState([]);

  const [sessions, setSessions] = useState({});

  const [
    selectedExchangeId,
    setSelectedExchangeId,
  ] = useState(null);

  const [
    showSessionForm,
    setShowSessionForm,
  ] = useState(false);

  const [sessionForm, setSessionForm] = useState({
    title: "",
    session_date: "",
    start_time: "",
    duration_minutes: 60,
    session_type: "ONLINE",
    meeting_link: "",
  });

  const [
    reviewExchangeId,
    setReviewExchangeId,
  ] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [loading, setLoading] = useState(true);

  const [
    processingId,
    setProcessingId,
  ] = useState(null);

  const [
    sessionLoading,
    setSessionLoading,
  ] = useState(false);

  const [
    reviewLoading,
    setReviewLoading,
  ] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =========================
  // LOAD EXCHANGE DATA
  // =========================

  const loadExchangeData = async () => {
    try {
      setError("");

      const [
        profileData,
        receivedData,
        sentData,
        exchangesData,
      ] = await Promise.all([
        getMyProfile(),
        getReceivedExchangeRequests(),
        getSentExchangeRequests(),
        getMyExchanges(),
      ]);

      setProfile(profileData);

      setReceived(
        receivedData || []
      );

      setSent(
        sentData || []
      );

      setExchanges(
        exchangesData || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadExchangeData();
  }, []);


  // =========================
  // GET SKILL PARTNER
  // =========================

  const getSkillPartner = (exchange) => {
    if (!profile) {
      return {
        id: null,
        name: "Unknown User",
      };
    }

    if (
      exchange.user_a_id === profile.id
    ) {
      return {
        id: exchange.user_b_id,
        name: exchange.user_b_name,
      };
    }

    return {
      id: exchange.user_a_id,
      name: exchange.user_a_name,
    };
  };


  // =========================
  // ACCEPT REQUEST
  // =========================

  const handleAccept = async (
    requestId
  ) => {
    try {
      setProcessingId(requestId);
      setMessage("");
      setError("");

      await acceptExchangeRequest(
        requestId
      );

      setMessage(
        "Exchange request accepted successfully."
      );

      await loadExchangeData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };


  // =========================
  // REJECT REQUEST
  // =========================

  const handleReject = async (
    requestId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this exchange request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(requestId);
      setMessage("");
      setError("");

      await rejectExchangeRequest(
        requestId
      );

      setMessage(
        "Exchange request rejected."
      );

      await loadExchangeData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };


  // =========================
  // VIEW SESSIONS
  // =========================

  const handleViewSessions = async (
    exchangeId
  ) => {
    try {
      setSessionLoading(true);
      setError("");

      const data =
        await getExchangeSessions(
          exchangeId
        );

      setSessions((previous) => ({
        ...previous,
        [exchangeId]: data || [],
      }));

      setSelectedExchangeId(
        exchangeId
      );

      setShowSessionForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSessionLoading(false);
    }
  };


  // =========================
  // OPEN SESSION FORM
  // =========================

  const handleOpenSessionForm = (
    exchangeId
  ) => {
    setSelectedExchangeId(
      exchangeId
    );

    setShowSessionForm(true);

    setSessionForm({
      title: "",
      session_date: "",
      start_time: "",
      duration_minutes: 60,
      session_type: "ONLINE",
      meeting_link: "",
    });

    setMessage("");
    setError("");
  };


  // =========================
  // SESSION FORM CHANGE
  // =========================

  const handleSessionChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setSessionForm((previous) => ({
      ...previous,

      [name]:
        name === "duration_minutes"
          ? Number(value)
          : value,
    }));
  };


  // =========================
  // SCHEDULE SESSION
  // =========================

  const handleScheduleSession = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedExchangeId) {
      return;
    }

    try {
      setSessionLoading(true);
      setMessage("");
      setError("");

      await createExchangeSession(
        selectedExchangeId,
        sessionForm
      );

      setMessage(
        "Session scheduled successfully."
      );

      const updatedSessions =
        await getExchangeSessions(
          selectedExchangeId
        );

      setSessions((previous) => ({
        ...previous,

        [selectedExchangeId]:
          updatedSessions || [],
      }));

      setShowSessionForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSessionLoading(false);
    }
  };


  // =========================
  // COMPLETE SESSION
  // =========================

  const handleCompleteSession = async (
    exchangeId,
    sessionId
  ) => {
    const confirmed = window.confirm(
      "Mark this session as completed?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSessionLoading(true);
      setMessage("");
      setError("");

      await completeSession(
        sessionId
      );

      setMessage(
        "Session completed successfully."
      );

      const updatedSessions =
        await getExchangeSessions(
          exchangeId
        );

      setSessions((previous) => ({
        ...previous,

        [exchangeId]:
          updatedSessions || [],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSessionLoading(false);
    }
  };


  // =========================
  // COMPLETE EXCHANGE
  // =========================

  const handleCompleteExchange = async (
    exchangeId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to complete this exchange?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        exchangeId
      );

      setMessage("");
      setError("");

      await completeExchange(
        exchangeId
      );

      setMessage(
        "Exchange completed successfully."
      );

      setSelectedExchangeId(
        null
      );

      setShowSessionForm(
        false
      );

      await loadExchangeData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };


  // =========================
  // OPEN REVIEW FORM
  // =========================

  const handleOpenReviewForm = (
    exchangeId
  ) => {
    setReviewExchangeId(
      exchangeId
    );

    setReviewForm({
      rating: 5,
      comment: "",
    });

    setMessage("");
    setError("");
  };


  // =========================
  // REVIEW FORM CHANGE
  // =========================

  const handleReviewChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setReviewForm((previous) => ({
      ...previous,

      [name]:
        name === "rating"
          ? Number(value)
          : value,
    }));
  };


  // =========================
  // SUBMIT REVIEW
  // =========================

  const handleSubmitReview = async (
    event
  ) => {
    event.preventDefault();

    if (!reviewExchangeId) {
      return;
    }

    try {
      setReviewLoading(true);
      setMessage("");
      setError("");

      await submitReview(
        reviewExchangeId,
        reviewForm
      );

      setMessage(
        "Review submitted successfully."
      );

      setReviewExchangeId(
        null
      );

      setReviewForm({
        rating: 5,
        comment: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="exchanges-loading">
        Loading exchanges...
      </div>
    );
  }


  const activeExchanges =
    exchanges.filter(
      (exchange) =>
        exchange.status === "ACTIVE"
    );


  const completedExchanges =
    exchanges.filter(
      (exchange) =>
        exchange.status === "COMPLETED"
    );


  return (
    <StudentLayout>

      <div className="exchanges-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="exchanges-header">

          <p className="exchanges-label">
            EXCHANGES
          </p>

          <h1>
            Manage Your Exchanges
          </h1>

          <p>
            Review requests, schedule sessions,
            manage exchanges and leave reviews.
          </p>

        </header>


        {/* =========================
            MESSAGES
        ========================== */}

        {message && (
          <div className="exchange-success">
            {message}
          </div>
        )}


        {error && (
          <div className="exchange-error">
            {error}
          </div>
        )}


        {/* =========================
            SUMMARY
        ========================== */}

        <section className="exchange-summary-grid">

          <div className="exchange-summary-card">

            <p>
              Received Requests
            </p>

            <h2>
              {received.length}
            </h2>

          </div>


          <div className="exchange-summary-card">

            <p>
              Sent Requests
            </p>

            <h2>
              {sent.length}
            </h2>

          </div>


          <div className="exchange-summary-card">

            <p>
              Active Exchanges
            </p>

            <h2>
              {activeExchanges.length}
            </h2>

          </div>


          <div className="exchange-summary-card">

            <p>
              Completed Exchanges
            </p>

            <h2>
              {completedExchanges.length}
            </h2>

          </div>

        </section>


        {/* =========================
            RECEIVED REQUESTS
        ========================== */}

        <section className="exchange-section">

          <div className="exchange-section-header">

            <h2>
              Received Requests
            </h2>

            <p>
              Requests other students sent to you.
            </p>

          </div>


          {received.length === 0 ? (

            <div className="exchange-empty">
              No received requests.
            </div>

          ) : (

            <div className="request-list">

              {received.map(
                (request) => (

                  <div
                    className="request-card"
                    key={request.id}
                  >

                    <div>

                      <h3>
                        Exchange Request #
                        {request.id}
                      </h3>


                      <p>
                        <strong>
                          From:
                        </strong>{" "}
                        {request.sender_name}
                      </p>


                      <p>
                        <strong>
                          They Offer:
                        </strong>{" "}
                        {
                          request.offered_skill_name
                        }
                      </p>


                      <p>
                        <strong>
                          They Want to Learn:
                        </strong>{" "}
                        {
                          request.requested_skill_name
                        }
                      </p>


                      {request.message && (
                        <p className="request-message">
                          “{request.message}”
                        </p>
                      )}


                      <span
                        className={`request-status ${
                          request.status.toLowerCase()
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>


                    {request.status ===
                      "PENDING" && (

                      <div className="request-actions">

                        <button
                          type="button"
                          className="accept-button"
                          onClick={() =>
                            handleAccept(
                              request.id
                            )
                          }
                          disabled={
                            processingId ===
                            request.id
                          }
                        >
                          {processingId ===
                          request.id
                            ? "Processing..."
                            : "Accept"}
                        </button>


                        <button
                          type="button"
                          className="reject-button"
                          onClick={() =>
                            handleReject(
                              request.id
                            )
                          }
                          disabled={
                            processingId ===
                            request.id
                          }
                        >
                          Reject
                        </button>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* =========================
            ACTIVE EXCHANGES
        ========================== */}

        <section className="exchange-section">

          <div className="exchange-section-header">

            <h2>
              Active Exchanges
            </h2>

            <p>
              Schedule and complete learning sessions.
            </p>

          </div>


          {activeExchanges.length === 0 ? (

            <div className="exchange-empty">
              No active exchanges.
            </div>

          ) : (

            <div className="active-exchange-grid">

              {activeExchanges.map(
                (exchange) => {

                  const partner =
                    getSkillPartner(
                      exchange
                    );

                  return (
                    <div
                      className="active-exchange-card"
                      key={exchange.id}
                    >

                      <div className="active-exchange-heading">

                        <div>

                          <h3>
                            Exchange #
                            {exchange.id}
                          </h3>

                          <p>
                            Skill Partner
                          </p>

                          <h4 className="exchange-partner-name">
                            {partner.name}
                          </h4>

                        </div>


                        <span className="active-badge">
                          ACTIVE
                        </span>

                      </div>


                      {/* ACTION BUTTONS */}

                      <div className="session-action-buttons">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewSessions(
                              exchange.id
                            )
                          }
                        >
                          View Sessions
                        </button>


                        <button
                          type="button"
                          className="schedule-session-button"
                          onClick={() =>
                            handleOpenSessionForm(
                              exchange.id
                            )
                          }
                        >
                          + Schedule Session
                        </button>


                        <button
                          type="button"
                          className="complete-exchange-button"
                          onClick={() =>
                            handleCompleteExchange(
                              exchange.id
                            )
                          }
                          disabled={
                            processingId ===
                            exchange.id
                          }
                        >
                          {processingId ===
                          exchange.id
                            ? "Completing..."
                            : "✓ Complete Exchange"}
                        </button>

                      </div>


                      {/* =========================
                          SESSIONS
                      ========================== */}

                      {selectedExchangeId ===
                        exchange.id &&
                        sessions[
                          exchange.id
                        ] && (

                        <div className="sessions-area">

                          <h4>
                            Sessions
                          </h4>


                          {sessions[
                            exchange.id
                          ].length === 0 ? (

                            <p className="no-session-text">
                              No sessions scheduled yet.
                            </p>

                          ) : (

                            <div className="session-list">

                              {sessions[
                                exchange.id
                              ].map(
                                (session) => (

                                  <div
                                    className="session-card"
                                    key={session.id}
                                  >

                                    <div>

                                      <h4>
                                        {session.title}
                                      </h4>


                                      <p>
                                        📅{" "}
                                        {
                                          session.session_date
                                        }
                                      </p>


                                      <p>
                                        🕒{" "}
                                        {
                                          session.start_time
                                        }
                                      </p>


                                      <p>
                                        ⏱{" "}
                                        {
                                          session.duration_minutes
                                        }{" "}
                                        minutes
                                      </p>


                                      <p>
                                        Type:{" "}
                                        {
                                          session.session_type
                                        }
                                      </p>


                                      {session.meeting_link && (

                                        <a
                                          href={
                                            session.meeting_link
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Open Meeting Link
                                        </a>

                                      )}

                                    </div>


                                    <div className="session-status-area">

                                      <span
                                        className={`session-status ${
                                          session.status.toLowerCase()
                                        }`}
                                      >
                                        {
                                          session.status
                                        }
                                      </span>


                                      {session.status ===
                                        "SCHEDULED" && (

                                        <button
                                          type="button"
                                          className="complete-session-button"
                                          onClick={() =>
                                            handleCompleteSession(
                                              exchange.id,
                                              session.id
                                            )
                                          }
                                        >
                                          Mark Complete
                                        </button>

                                      )}

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =========================
            SESSION FORM
        ========================== */}

        {showSessionForm && (

          <section className="exchange-section session-form-section">

            <div className="exchange-section-header">

              <h2>
                Schedule Session for Exchange #
                {selectedExchangeId}
              </h2>

              <p>
                Add the session date, time and
                meeting details.
              </p>

            </div>


            <form
              onSubmit={
                handleScheduleSession
              }
            >

              <div className="session-form-grid">


                <div className="session-form-group">

                  <label htmlFor="session-title">
                    Title
                  </label>

                  <input
                    id="session-title"
                    name="title"
                    type="text"
                    value={
                      sessionForm.title
                    }
                    onChange={
                      handleSessionChange
                    }
                    placeholder="Example: Python Basics Session"
                    required
                  />

                </div>


                <div className="session-form-group">

                  <label htmlFor="session-date">
                    Date
                  </label>

                  <input
                    id="session-date"
                    type="date"
                    name="session_date"
                    value={
                      sessionForm.session_date
                    }
                    onChange={
                      handleSessionChange
                    }
                    required
                  />

                </div>


                <div className="session-form-group">

                  <label htmlFor="session-time">
                    Start Time
                  </label>

                  <input
                    id="session-time"
                    type="time"
                    name="start_time"
                    value={
                      sessionForm.start_time
                    }
                    onChange={
                      handleSessionChange
                    }
                    required
                  />

                </div>


                <div className="session-form-group">

                  <label htmlFor="session-duration">
                    Duration
                  </label>

                  <input
                    id="session-duration"
                    type="number"
                    name="duration_minutes"
                    min="15"
                    value={
                      sessionForm.duration_minutes
                    }
                    onChange={
                      handleSessionChange
                    }
                    required
                  />

                </div>


                <div className="session-form-group">

                  <label htmlFor="session-type">
                    Session Type
                  </label>

                  <select
                    id="session-type"
                    name="session_type"
                    value={
                      sessionForm.session_type
                    }
                    onChange={
                      handleSessionChange
                    }
                  >

                    <option value="ONLINE">
                      Online
                    </option>

                    <option value="PHYSICAL">
                      Physical
                    </option>

                  </select>

                </div>


                <div className="session-form-group">

                  <label htmlFor="meeting-link">
                    Meeting Link
                  </label>

                  <input
                    id="meeting-link"
                    name="meeting_link"
                    type="url"
                    value={
                      sessionForm.meeting_link
                    }
                    onChange={
                      handleSessionChange
                    }
                    placeholder="https://meet.example.com/..."
                  />

                </div>

              </div>


              <div className="session-form-actions">

                <button
                  className="save-session-button"
                  type="submit"
                  disabled={
                    sessionLoading
                  }
                >
                  {sessionLoading
                    ? "Scheduling..."
                    : "Schedule Session"}
                </button>


                <button
                  className="cancel-session-button"
                  type="button"
                  onClick={() =>
                    setShowSessionForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}


        {/* =========================
            COMPLETED EXCHANGES
        ========================== */}

        <section className="exchange-section">

          <div className="exchange-section-header">

            <h2>
              Completed Exchanges
            </h2>

            <p>
              Finished exchanges that you can review.
            </p>

          </div>


          {completedExchanges.length ===
          0 ? (

            <div className="exchange-empty">
              No completed exchanges.
            </div>

          ) : (

            <div className="completed-exchange-grid">

              {completedExchanges.map(
                (exchange) => {

                  const partner =
                    getSkillPartner(
                      exchange
                    );

                  return (
                    <div
                      className="completed-exchange-card"
                      key={exchange.id}
                    >

                      <div>

                        <h3>
                          Exchange #
                          {exchange.id}
                        </h3>

                        <p>
                          Skill Partner
                        </p>

                        <h4 className="exchange-partner-name">
                          {partner.name}
                        </h4>

                        <span className="completed-badge">
                          COMPLETED
                        </span>

                      </div>


                      <button
                        type="button"
                        className="review-button"
                        onClick={() =>
                          handleOpenReviewForm(
                            exchange.id
                          )
                        }
                      >
                        Leave Review
                      </button>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =========================
            REVIEW FORM
        ========================== */}

        {reviewExchangeId && (

          <section className="exchange-section review-form-section">

            <div className="exchange-section-header">

              <h2>
                Review Exchange #
                {reviewExchangeId}
              </h2>

              <p>
                Rate your experience with this
                skill exchange.
              </p>

            </div>


            <form
              onSubmit={
                handleSubmitReview
              }
            >

              <div className="review-form-group">

                <label htmlFor="review-rating">
                  Rating
                </label>

                <select
                  id="review-rating"
                  name="rating"
                  value={
                    reviewForm.rating
                  }
                  onChange={
                    handleReviewChange
                  }
                >

                  <option value={5}>
                    5 - Excellent
                  </option>

                  <option value={4}>
                    4 - Very Good
                  </option>

                  <option value={3}>
                    3 - Good
                  </option>

                  <option value={2}>
                    2 - Fair
                  </option>

                  <option value={1}>
                    1 - Poor
                  </option>

                </select>

              </div>


              <div className="review-form-group">

                <label htmlFor="review-comment">
                  Comment
                </label>

                <textarea
                  id="review-comment"
                  name="comment"
                  rows="4"
                  value={
                    reviewForm.comment
                  }
                  onChange={
                    handleReviewChange
                  }
                  placeholder="Write a short review..."
                  required
                />

              </div>


              <div className="review-form-actions">

                <button
                  className="submit-review-button"
                  type="submit"
                  disabled={
                    reviewLoading
                  }
                >
                  {reviewLoading
                    ? "Submitting..."
                    : "Submit Review"}
                </button>


                <button
                  className="cancel-review-button"
                  type="button"
                  onClick={() =>
                    setReviewExchangeId(
                      null
                    )
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}


        {/* =========================
            SENT REQUESTS
        ========================== */}

        <section className="exchange-section">

          <div className="exchange-section-header">

            <h2>
              Sent Requests
            </h2>

            <p>
              Requests you have sent to other students.
            </p>

          </div>


          {sent.length === 0 ? (

            <div className="exchange-empty">
              No sent requests.
            </div>

          ) : (

            <div className="request-list">

              {sent.map(
                (request) => (

                  <div
                    className="request-card"
                    key={request.id}
                  >

                    <div>

                      <h3>
                        Request #
                        {request.id}
                      </h3>


                      <p>
                        <strong>
                          To:
                        </strong>{" "}
                        {
                          request.receiver_name
                        }
                      </p>


                      <p>
                        <strong>
                          You Offer:
                        </strong>{" "}
                        {
                          request.offered_skill_name
                        }
                      </p>


                      <p>
                        <strong>
                          You Want to Learn:
                        </strong>{" "}
                        {
                          request.requested_skill_name
                        }
                      </p>


                      {request.message && (
                        <p className="request-message">
                          “{request.message}”
                        </p>
                      )}


                      <span
                        className={`request-status ${
                          request.status.toLowerCase()
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </StudentLayout>
  );
}


export default Exchanges;
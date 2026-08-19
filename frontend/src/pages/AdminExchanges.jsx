import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";

import { getAdminExchanges } from "../service/api";

import "./AdminExchanges.css";


function AdminExchanges() {
  const [exchanges, setExchanges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD EXCHANGES
  // =========================

  useEffect(() => {
    const loadExchanges = async () => {
      try {
        setError("");

        const data =
          await getAdminExchanges();

        setExchanges(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExchanges();
  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="admin-exchanges-loading">
        Loading exchanges...
      </div>
    );
  }


  // =========================
  // SUMMARY VALUES
  // =========================

  const activeCount = exchanges.filter(
    (exchange) =>
      exchange.status === "ACTIVE"
  ).length;


  const completedCount = exchanges.filter(
    (exchange) =>
      exchange.status === "COMPLETED"
  ).length;


  return (
    <AdminLayout>

      <div className="admin-exchanges-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="admin-exchanges-header">

          <div>

            <p className="admin-exchanges-label">
              EXCHANGE MANAGEMENT
            </p>

            <h1>
              Monitor Exchanges
            </h1>

            <p>
              View platform exchanges,
              participants, sessions and
              review activity.
            </p>

          </div>

        </header>


        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="admin-exchanges-error">
            {error}
          </div>
        )}


        {/* =========================
            SUMMARY
        ========================== */}

        <section className="admin-exchange-summary-grid">

          <div className="admin-exchange-summary-card">

            <p>
              Total Exchanges
            </p>

            <h2>
              {exchanges.length}
            </h2>

          </div>


          <div className="admin-exchange-summary-card">

            <p>
              Active Exchanges
            </p>

            <h2>
              {activeCount}
            </h2>

          </div>


          <div className="admin-exchange-summary-card">

            <p>
              Completed Exchanges
            </p>

            <h2>
              {completedCount}
            </h2>

          </div>

        </section>


        {/* =========================
            ALL EXCHANGES
        ========================== */}

        <section className="admin-exchanges-card">

          <div className="admin-exchanges-card-header">

            <div>

              <h2>
                All Exchanges
              </h2>

              <p>
                Read-only platform exchange monitoring.
              </p>

            </div>

          </div>


          {exchanges.length === 0 ? (

            <div className="admin-exchanges-empty">
              No exchanges found.
            </div>

          ) : (

            <div className="admin-exchanges-table-wrapper">

              <table className="admin-exchanges-table">

                <thead>

                  <tr>
                    <th>Exchange</th>
                    <th>Student A</th>
                    <th>Student B</th>
                    <th>Status</th>
                    <th>Sessions</th>
                    <th>Reviews</th>
                  </tr>

                </thead>


                <tbody>

                  {exchanges.map((exchange) => (

                    <tr key={exchange.id}>

                      {/* EXCHANGE */}

                      <td>

                        <div className="exchange-id-cell">

                          <strong>
                            #{exchange.id}
                          </strong>

                          <span>
                            Request #
                            {exchange.exchange_request_id}
                          </span>

                        </div>

                      </td>


                      {/* STUDENT A */}

                      <td>

                        <div className="exchange-user-cell">

                          <strong>
                            {exchange.user_a_name}
                          </strong>

                          <span>
                            User ID:{" "}
                            {exchange.user_a_id}
                          </span>

                        </div>

                      </td>


                      {/* STUDENT B */}

                      <td>

                        <div className="exchange-user-cell">

                          <strong>
                            {exchange.user_b_name}
                          </strong>

                          <span>
                            User ID:{" "}
                            {exchange.user_b_id}
                          </span>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-exchange-status ${
                            exchange.status.toLowerCase()
                          }`}
                        >
                          {exchange.status}
                        </span>

                      </td>


                      {/* SESSIONS */}

                      <td>
                        {exchange.session_count}
                      </td>


                      {/* REVIEWS */}

                      <td>
                        {exchange.review_count}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </AdminLayout>
  );
}


export default AdminExchanges;
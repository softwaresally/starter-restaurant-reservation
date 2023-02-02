import React, { useEffect, useState } from "react";
import { clearTable, listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import DateChange from "./DateChange";
import ListReservations from "../reservations/ListReservations";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  const urlDate = useQuery().get("date");

  if (urlDate) {
    date = urlDate;
  };

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  const reservationsList = reservations.map((reservation) => {
    if (reservation.status === "cancelled" || reservation.status === "finished") 
      return null;
    
    return (
      <ListReservations key={reservation.reservation_id} reservation={reservation} />
    );
  });

  async function finishTable(event) {
    const abortController = new AbortController();
    event.preventDefault();
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      await clearTable(event.target.name, abortController.signal);
      history.go(0);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <DateChange date={date} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div>
        {reservationsList}
      </div>
      <hr />
      <h4>Tables:</h4>
      <hr />
      <div>
        {tables.map((table, id) => {
          return (
            <div key={table.table_id}>
              <h6>Table: {table.table_name} - Capacity: {table.capacity}</h6>
              {table.reservation_id && <div>
                <p data-table-id-status={`${table.table_id}`} value={table.table_id}>
                  Occupied
                </p>
                <button className="btn btn-outline-dark" name={table.table_id} data-table-id-finish={table.table_id} onClick={(event) => finishTable(event)}>
                  Finish Table
                </button>
                </div>
                }
              {!table.reservation_id && <div>
                <p data-table-id-status={`${table.table_id}`}>
                  Free
                </p> </div>}
                <hr />
            </div>
          )
        })}
      </div>
    </main>
  );
}

export default Dashboard;

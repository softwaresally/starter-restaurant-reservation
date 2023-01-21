import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ListReservations from "./ListReservations";

function SearchReservations() {
    const [number, setNumber] = useState({ mobile_number: "" });
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setNumber({ [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const params = {
            mobile_number: number.mobile_number,
        };
        setError(null);
        try {
            const reservationsByMobileNumber = await listReservations(
                params,
                abortController.signal,
            );
            setReservations(reservationsByMobileNumber);
        } catch (error) {
            if (error.name !== "AbortError") setError(error);
        }
        return () => abortController.abort();
    }

    const displayResults = 
        reservations.length > 0 
            ? reservations.map((reservation) => (
                <ListReservations key={reservation.reservation_id} reservation={reservation} />
            )) : "No reservations found.";

    return (
        <div>
            <hr />
            <h5>Search for a reservation by phone number</h5>
            <hr />
            <form onSubmit={handleSubmit}>
                <ErrorAlert error={error} />
                <label htmlFor="mobile_number">
                    Enter a mobile number:
                    <input 
                        className="form-control"
                        name="mobile_number"
                        type="tel"
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button className="btn btn-dark" type="submit">
                    Find
                </button>
            </form>
            <div>
                {displayResults}
            </div>
        </div>
    )
}

export default SearchReservations;